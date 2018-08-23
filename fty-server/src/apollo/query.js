const {map, fromPairs} = require('lodash')
const {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLID,
  GraphQLList,
  GraphQLString
} = require('graphql')
const GraphQLJSON = require('graphql-type-json')
const { readModel, getTypesNames } = require('./db/model')
const { read, readChild, readChildren, readMap, inspect } = require('./resolve')

const RichTextType = new GraphQLScalarType({
  name: 'RichText',
  serialize: value => value
})

const ImageType = new GraphQLScalarType({
  name: 'Image',
  serialize: value => value
})

const buildSchemaObject = function () {
  return new GraphQLObjectType({
    name: 'Schema',
    fields: {name: {type: GraphQLString}}
  })
}

const buildObjects = async function () {
  const model = await readModel()
  const modelTypes = getTypesNames(model)
  console.log(modelTypes)
  const EntryInterface = new GraphQLInterfaceType({
    name: 'Entry',
    fields: {
      _id_: {type: GraphQLID},
      _newId_: {type: GraphQLID},
      _type_: {type: GraphQLString}
      // _tree_: {type: GraphQLString}
    },
    resolveType: value => ObjectTypes[value._type_]
  })
  const KeyValuePair = new GraphQLObjectType({
    name: 'KeyValuePair',
    fields: () => ({
      _key_: { type: GraphQLString },
      _value_: { type: EntryInterface },
      _list_: { type: new GraphQLList(EntryInterface) }
    })
  });

  const buildField = field => {
    const fieldType = field.type[0];
    let type;
    switch (fieldType) {
      case 'link':
        type = field.type[1] === '*' ? EntryInterface : ObjectTypes[field.type[1]];
        return { type, resolve: root => readChild(root[field.name]) };
      case 'links':
        type =
          field.type[1] === '*'
            ? new GraphQLList(EntryInterface)
            : new GraphQLList(ObjectTypes[field.type[1]]);
        return {
          type,
          resolve: root => readChildren(root[field.name], modelTypes)
        };
      case 'map':
        return {
          type: new GraphQLList(KeyValuePair),
          resolve: root => readMap(root[field.name], modelTypes)
        };
      case 'json':
        return { type: GraphQLJSON };
      case 'richtext':
        return { type: RichTextType };
      case 'image':
        return { type: ImageType };
      default:
        return { type: GraphQLString };
    }
  };
  const ObjectTypes = fromPairs(
    model.map(structure => {
      return [
        structure.name,
        new GraphQLObjectType({
          name: structure.name,
          // interfaces: [EntryInterface],
          fields: () => ({
            // _id_: {type: GraphQLID},
            // _new_id: {type: GraphQLID},
            // _type_: {type: GraphQLString},
            // _tree_: {
            //   type: GraphQLString,
            //   resolve: root => inspect(root, modelTypes)
            // },
            ...fromPairs(structure.fields.map(field => [field.name, buildField(field)]))
          })
        })
      ]
    })
  )
  ObjectTypes.Schema = buildSchemaObject()
  return ObjectTypes
}

const buildQuery = function (ObjecTypes) {
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: () =>
      fromPairs(
        map(ObjecTypes, (value, key) => [
          key,
          {
            type: new GraphQLList(value),
            args: {id: {type: GraphQLID}},
            resolve: (root, {id}) => read(key, id)
          }
        ])
      )
  })
  return query
}

module.exports = {
  buildObjects,
  buildQuery
}
