const {map, fromPairs, concat} = require('lodash')
const {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull
} = require('graphql')
const GraphQLJSON = require('graphql-type-json')
const {readModel, getTypesNames} = require('./db/model')
const {read, readChild, readChildren, readMap, inspect} = require('./resolve')
const {entryTypes} = require('./db/read');

const buildSchemaObject = function () {
  return new GraphQLObjectType({
    name: 'Schema',
    fields: {name: {type: GraphQLString}}
  })
}

const buildObjects = async function (spaceId) {
  const model = await readModel()
  const modelTypes = getTypesNames(model)

  const EntryInterface = new GraphQLInterfaceType({
    name: 'EntryInterface',
    fields: {
      id: {type: GraphQLID},
      // _id_: {type: GraphQLID},
      // _newId_: {type: GraphQLID},
      _type_: {type: GraphQLString},
      _tree_: {type: GraphQLString}
    },
    resolveType: value => ObjectTypes[value._type_]
  })
  const KeyValuePair = new GraphQLObjectType({
    name: 'KeyValuePair',
    fields: () => ({
      _key_: {type: GraphQLString},
      _value_: {type: EntryInterface},
      _list_: {type: new GraphQLList(EntryInterface)}
    })
  });

  const buildField = field => {
    const fieldType = field.type;
    let type
    switch (fieldType) {
      case 'Symbol':
      case 'Text':
      case 'Date':
        return {
          type: GraphQLString
        }
      case 'Boolean':
        return {
          type: GraphQLBoolean
        }
      case 'Link': {
        type = ObjectTypes[field.linkType]
        return {
          type,
          resolve: (root) => readChild(type, root[field.name])
        }
      }
      case 'Array': {
        if (field.items.type === 'Link') {
          // [Field]
          type = new GraphQLList(ObjectTypes[field.items.linkType])
        }
        return {
          type,
          resolve: (root) => readChildren(field.items.linkType, root.id, spaceId)
        }
      }
      default:
        return {
          type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString
        }
    }
  }
  const queryTypes = fromPairs(
    model.map(structure => {
      return [
        structure.name,
        new GraphQLObjectType({
          name: structure.name,
          // interfaces: [EntryInterface],
          fields: () => ({
            id: {type: GraphQLID},
            ...fromPairs(structure.fields.map(field => [field.name, buildField(field)]))
          })
        })
      ]
    })
  )
  const queryCollection = fromPairs(
    model.map(structure => {
      return [
        structure.name + 'Collection',
        new GraphQLObjectType({
          name: structure.name + 'Collection',
          // interfaces: [EntryInterface],
          fields: () => ({
            skip: {type: new GraphQLNonNull(GraphQLInt)},
            limit: {type: new GraphQLNonNull(GraphQLInt)},
            total: {type: new GraphQLNonNull(GraphQLInt)},
            // _type_: { type: GraphQLString },
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
  const ObjectTypes = think._.assign(queryTypes, queryCollection)

  ObjectTypes.Schema = buildSchemaObject()
  return ObjectTypes
}

const buildQuery = function (ObjectTypes) {
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => {
      return fromPairs(
        map(ObjectTypes, (value, key) => {
          let singleQuery = []
          let collectionQuery = []
            if (think._.includes(key, 'Collection')) {
              collectionQuery = [
                key,
                {
                  type: new GraphQLList(value),
                  args: {
                    skip: {type: GraphQLInt},
                    limit: {type: GraphQLInt}
                  },
                  resolve: (root, {id, spaceId}) => read(key, id, spaceId)
                }
              ]
            } else {
              singleQuery = [
                key,
                {
                  type: new GraphQLList(value),
                  args: {
                    id: {
                      type: GraphQLID
                    },
                    spaceId: {
                      type: GraphQLID
                    }
                  },
                  resolve: (root, {id, spaceId}) => read(key, id, spaceId)
                }
              ]
            }
            return think._.concat(singleQuery, collectionQuery)
          }
        )
      )
    }
  })
  return query
}

module.exports = {
  buildObjects,
  buildQuery
}
