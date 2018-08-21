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

// const { read, readChild, readChildren, readMap, inspect } = require('resolve')

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
  // const model = await readModel()
  // const modelTypes = getTypeNames(model)
  const model = {}
  const EntryInterface = new GraphQLInterfaceType({
    name: 'Entry',
    fields: {
      _id_: {type: GraphQLID},
      _newId_: {type: GraphQLID},
      _type_: {type: GraphQLString},
      _tree_: {type: GraphQLString}
    },
    // resolveType: value => ObjectTypes
  })

  const ObjectTypes = fromPairs(
    model.map(structure => {
      return [
        structure.name,
        new GraphQLObjectType({
          name: structure.name,
          interfaces: [EntryInterface],
          fields: () => ({
            _id_: {type: GraphQLID},
            _new_id: {type: GraphQLID},
            _type_: {type: GraphQLString},
            _tree_: {
              type: GraphQLString,
              resolve: root => inspect(root, modelTypes)
            },
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
