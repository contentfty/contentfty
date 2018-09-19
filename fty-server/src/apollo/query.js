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
  const model = await readModel(spaceId)
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
  const suffixMethods = [
    'ById',
    'ByIds',
    'One',
    'Many',
    'Total',
    'Pagination'
  ]

  const queryTypes = fromPairs(
    model.map(structure => {
      return [
        `${structure.name}`,
        new GraphQLObjectType({
          name: `${structure.name}`,
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
          fields: () => {
            return {
              skip: {type: new GraphQLNonNull(GraphQLInt)},
              limit: {type: new GraphQLNonNull(GraphQLInt)},
              total: {type: new GraphQLNonNull(GraphQLInt)},
              data: {
                type: new GraphQLList(new GraphQLObjectType({
                  name: structure.name + 'Data',
                  fields: () => {
                    return {...fromPairs(structure.fields.map(field => [field.name, buildField(field)]))}
                  }
                }))
              }
              // data: new GraphQLList(fromPairs(structure.fields.map(field => [field.name, buildField(field)])))
              // data: {...fromPairs(structure.fields.map(field => [field.name, buildField(field)]))}
            }
          }
        })
      ]
    })
  )
  let ObjectTypes = think._.assign(queryTypes, queryCollection)
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
        type: GraphQLString
      }
    case 'Boolean':
      return {
        type: GraphQLString
      }
    default:
      return {
        type: GraphQLString
      }
  }
}

const buildFilters = async function () {
  const InputType = {}
  const model = await readModel('8784tvwc6dpm')
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

const buildQuery = async function (ObjectTypes, spaceId) {
  // 构建全部查询条件输入类型
  const filterType = await buildFilters()
  let queryTypeList = []
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => {
      return fromPairs(
        map(ObjectTypes, (value, key) => {
            const suffixMethods = [
              'ById',
              'ByIds',
              'One',
              'Many',
              'Total',
              'Pagination'
            ]
            let ById = []
            let ByIds = []
            let One = []
            let Many = []
            let Total = []
            let Pagination = []
            // let typeTemp = []
            // for (let method of suffixMethods) {
            if (think._.includes(key, 'ById')) {
              ById = [
                `${think._.camelCase(key)}ById`,
                {
                  type: new GraphQLList(value),
                  args: {
                    id: {
                      type: GraphQLID
                    }
                  },
                  resolve: (root, {id}) => read(key, id, spaceId)
                }
              ]
            } else {
              // if (think._.includes(key, 'ByIds')) {
              //
              //   ByIds = [
              //     `${think._.camelCase(key)}ByIds`,
              //     {
              //       type: new GraphQLList(value),
              //       args: {
              //         id: {
              //           type: GraphQLID
              //         }
              //       },
              //       resolve: (root, {id}) => read(key, id, spaceId)
              //     }
              //   ]


              One = [
                `${think._.camelCase(key)}One`,
                {
                  type: new GraphQLList(value),
                  args: {
                    id: {
                      type: GraphQLID
                    }
                  },
                  resolve: (root, {id}) => read(key, id, spaceId)
                }
              ]
              Many = [
                `${think._.camelCase(key)}Many`,
                {
                  type: new GraphQLList(value),
                  args: {
                    id: {
                      type: GraphQLID
                    }
                  },
                  resolve: (root, {id}) => read(key, id, spaceId)
                }
              ]
              Total = [
                `${think._.camelCase(key)}Total`,
                {
                  type: new GraphQLList(value),
                  args: {
                    id: {
                      type: GraphQLID
                    }
                  },
                  resolve: (root, {id}) => read(key, id, spaceId)
                }
              ]
              Pagination = [
                `${think._.camelCase(key)}Pagination`,
                {
                  type: new GraphQLList(value),
                  args: {
                    id: {
                      type: GraphQLID
                    }
                  },
                  resolve: (root, {id}) => read(key, id, spaceId)
                }
              ]
            }
            return think._.concat(ById, ByIds, One, Many, Total, Pagination)
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
