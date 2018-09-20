const {map, fromPairs, concat} = require('lodash')
const {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType
} = require('graphql')
const {readModel, getTypesNames} = require('./db/model')
const {read, readChild, readChildren, readMap, inspect} = require('./resolve')

const buildObjects = async function (spaceId) {
  const model = await readModel(spaceId)

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
        `${structure.id}`,
        new GraphQLObjectType({
          name: `${think._.upperFirst(structure.id)}`,
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
  // const queryCollection = fromPairs(
  //   model.map(structure => {
  //     return [
  //       structure.name + 'Collection',
  //       new GraphQLObjectType({
  //         name: structure.name + 'Collection',
  //         // interfaces: [EntryInterface],
  //         fields: () => {
  //           return {
  //             skip: {type: new GraphQLNonNull(GraphQLInt)},
  //             limit: {type: new GraphQLNonNull(GraphQLInt)},
  //             total: {type: new GraphQLNonNull(GraphQLInt)},
  //             data: {
  //               type: new GraphQLList(new GraphQLObjectType({
  //                 name: structure.name + 'Data',
  //                 fields: () => {
  //                   return {...fromPairs(structure.fields.map(field => [field.name, buildField(field)]))}
  //                 }
  //               }))
  //             }
  //             // data: new GraphQLList(fromPairs(structure.fields.map(field => [field.name, buildField(field)])))
  //             // data: {...fromPairs(structure.fields.map(field => [field.name, buildField(field)]))}
  //           }
  //         }
  //       })
  //     ]
  //   })
  // )
  // let ObjectTypes = think._.assign(queryTypes, queryCollection)
  let ObjectTypes = think._.assign(queryTypes)
  // ObjectTypes.Schema = buildSchemaObject()
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
    InputType[`${think._.camelCase(structure.id)}`] = new GraphQLInputObjectType({
      name: `${think._.camelCase(structure.id)}InputFilter`,
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

// const buildSortEInput = async function () {
//   const InputType = {}
//   const model = await readModel('8784tvwc6dpm')
//   for (const structure of model) {
//     InputType[`${think._.camelCase(structure.name)}`] = new GraphQLEnumType({
//       name: `Sort${think._.camelCase(structure.name)}`,
//       fields: () => {
//         const resultFields = {
//           id: {type: GraphQLID}
//         }
//         Object.assign(
//           resultFields,
//           fromPairs(structure.fields.map(field => [field.name, buildFilterInput(field)]))
//         )
//         return resultFields
//       }
//     })
//   }
//   return InputType
// }

const buildQuery = async function (ObjectTypes, spaceId) {
  // 构建全部查询条件输入类型
  const filterType = await buildFilters()
  const suffixMethods = [
    'ById',
    'ByIds',
    'One',
    'Many',
    'Total',
    'Pagination'
  ]
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: () => {
      const _getReturnType = (method, value) => {
        if (method === 'ById' || method === 'ByIds' || method === 'One') {
          return value
        }
        if (method === 'Many') {
          return new GraphQLList(value)
        }
        if (method === 'Total') {
          return GraphQLInt
        }
        if (method === 'Pagination') {
          return new GraphQLList(value)
        }
      }
      const _getQueryArgs = (method, value) => {
        switch (method) {
          case 'ById': {
            return {
              id: {
                type: GraphQLID
              }
            }
          }
          case 'ByIds': {
            return {
              id: {
                type: GraphQLID
              },
              limit: {
                type: GraphQLInt,
                default: 1000
              }
            }
          }
          case 'One': {
            return {
              // FilterFindOneXXXInput
              filter: {type: filterType[think._.camelCase(value)]},
              skip: {
                type: GraphQLInt
              }
            }
          }
          case 'Many': {
            return {
              // FilterFindOneXXXInput
              filter: {type: filterType[think._.camelCase(value)]},
              skip: {type: GraphQLInt},
              limit: {
                type: GraphQLInt,
                default: 1000
              }
            }
          }
          case 'Total': {
            return {
              // FilterFindOneXXXInput
              filter: {type: filterType[think._.camelCase(value)]},
            }
          }
          case 'Pagination': {
            return {
              page: {
                type: GraphQLInt
              },
              pageSize: {
                type: GraphQLInt,
                default: 20
              },
              filter: {type: filterType[think._.camelCase(value)]},
            }
          }
        }
      }
      const pairs = map(ObjectTypes, (value, type) => {
          const queryMethods = []
          suffixMethods.forEach((method) => {
            // if (think._.indexOf(['ById', 'ByIds', 'One'], method)) {
            queryMethods.push([
              `${think._.camelCase(type)}${method}`,
              {
                type: _getReturnType(method, value),
                args: _getQueryArgs(method, value),
                resolve: (root, args) => {
                  /**
                   * @param type 内容类型
                   * @param spaceId 内容空间标识
                   * @param method 查询方式
                   * @param args 查询参数
                   * @returns {*}
                   */
                  return read(type, spaceId, method, args)
                }
              }
            ])
            // }
          })
          return think._.concat(queryMethods)
        }
      )
      // 去除一层数组形成键值对象
      return think._.fromPairs(think._.flatten(pairs))
    }
  })
  return query
}

module.exports = {
  buildObjects,
  buildQuery
}
