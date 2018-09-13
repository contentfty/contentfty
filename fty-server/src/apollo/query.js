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
  GraphQLNonNull,
  GraphQLInputObjectType
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
  // 处理返回值
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
const buildFilterInput = field => {
  const fieldType = field.type;
  switch (fieldType) {
    case 'Symbol':
    case 'Text':
    case 'Date':
      return {
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString
      }
    case 'Boolean':
      return {
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString
      }
    default:
      return {
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString
      }
  }
}

const buildFilters = async function () {
  const InputType = {}
  const model = await readModel()
  for (const structure of model) {
    InputType[structure.name] = new GraphQLInputObjectType({
      name: `${structure.name}Filter`,
      fields: () => {
        const resultFields = {
          id: {type: GraphQLID}
        }
        Object.assign(
          resultFields,
          fromPairs(structure.fields.map(field => [field.name, buildFilterInput(field)]))
        )
        return resultFields
      }
    })
  }
  return InputType
}

const buildQuery = async function (ObjectTypes) {
  // 构建全部查询条件输入类型
  const filterType = await buildFilters()

  const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => {
      return fromPairs(
        map(ObjectTypes, (value, key) => {
            let singleQuery = []
            let collectionQuery = []
            // 获取原始定义的 Key
            const originalKey = think._.upperFirst(think._.kebabCase(key).split('-')[0])
            if (think._.includes(key, 'Collection')) {
              collectionQuery = [
                key,
                {
                  type: new GraphQLList(value),
                  args: {
                    skip: {type: GraphQLInt},
                    limit: {type: GraphQLInt},
                    where: {
                      type: filterType[originalKey]
                    }
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
