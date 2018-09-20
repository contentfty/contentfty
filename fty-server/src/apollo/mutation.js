const {isString, fromPairs} = require('lodash')
const {InputTypeComposer, EnumTypeComposer} = require('graphql-compose')
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLNonNull
} = require('graphql')

const GraphQLJSON = require('graphql-type-json')

const {writeEntry} = require('./db/write')
const {deleteEntry} = require('./db/delete')
const {readModel, writeModel} = require('./db/model')
const LinkETC = EnumTypeComposer.create({
  name: 'SysTypeEnum',
  values: {
    ASSET: {value: 'Asset'},
    ENTRY: {value: 'Entry'},
    SPACE: {value: 'Space'},
    ENVIRONMENT: {value: 'Environment'}
  }
})
const FieldETC = EnumTypeComposer.create({
  name: 'FieldTypeEnum',
  values: {
    SHORT_TEXT: {value: 'symbol', description: '短文本, 一般用于标题、名称等; 最大长度 256字符'},
    LONG_TEXT: {value: 'text', description: '长文本，文章段落、大量文本, 最大长度  50,000字符'},
    INTEGER: {value: 'integer', description: '整型数字, -253 253'},
    DECIMAL: {value: 'number', description: '浮点数字'},
    DATE: {value: 'date', description: '日期, | "2018-11-06T09:45:27"'},
    LOCATION: {value: 'location', description: '地理位置座标, | {"lat": 52.5208, "lon": 13.4049}'},
    BOOLEAN: {value: 'boolean', description: '状态值，如：真或假，是或否 | true'},
    MEDIA: {value: 'link', description: '链接一个媒体资源，如：图片、文件等'},
    REFERENCE: {value: 'link', description: '链接一个条目，如：文章的作者'},
    ARRAY: {value: 'array', description: '列表，如课程的多个章节关联  | ["name1", "name2", ...]'},
    JSON_OBJECT: {value: 'object', description: '一些自定义的数据以 JSON 格式存储 | {"foo": "bar"}'}
  }
})


const LinkDataInputType = new GraphQLInputObjectType({
  name: 'LinkDataInput',
  fields: () => ({
    type: {
      type: GraphQLString
    },
    id: {
      type: GraphQLID
    }
  })
})

const LinkInputType = new GraphQLInputObjectType({
  name: 'LinkInput',
  fields: () => ({
    link: {
      type: LinkDataInputType
    }
  })
})

const _RegexpITC = InputTypeComposer.create({
  name: 'RegexpInput',
  fields: {
    pattern: 'String!'
  }
})

const _SizeITC = InputTypeComposer.create({
  name: 'Size',
  fields: {
    min: 'Int',
    max: 'Int'
  }
})
// 验证输入
const ValidationITC = InputTypeComposer.create({
  name: 'ValidationInput',
  fields: {
    size: _SizeITC,
    regexp: _RegexpITC,
    in: '[String]',
    message: 'String'
  }
  // types: [RegexpITC.getType(), SizeITC.getType()]
})

const ArrayItemITC = InputTypeComposer.create({
  name: "ArrayItemInput",
  fields: {
    type: FieldETC,
    validations: [ValidationITC]
  }
})

// 字段操作
const FieldITC = InputTypeComposer.create({
  name: 'EntryTypeFieldInput',
  description: '内容字段',
  fields: {
    id: {
      type: 'String',
      description: '字段唯一标识'
    },
    type: {
      type: FieldETC.getTypeNonNull(),
      description: '字段类型'
    },
    linkType: {
      type: LinkETC,
      description: 'Link 字段的类型'
    },
    name: {
      type: 'String!',
      description: '字段名'
    },
    title: {
      type: 'String',
      description: '字段标题'
    },
    instructions: {
      type: 'String',
      description: '字段简介'
    },
    unique: {
      type: 'Boolean',
      description: '字段是否唯一'
    },
    required: {
      type: 'Boolean',
      description: '字段是否必填'
    },
    validations: {
      type: [ValidationITC.getType()],
      description: '字段的验证规则'
    },
    items: {
      type: ArrayItemITC,
      description: '数组元素规则'
    },
    settings: {
      type: 'JSON',
      description: '字段的样式配置'
    }
  }
})

// 系统信息输入
const SysITC = InputTypeComposer.create({
  name: 'SysInfoInput',
  description: '系统内置格式内容',
  fields: {
    type: {
      type: LinkETC,
      description: '系统内置类型'
    },
    id: {
      type: 'String',
      description: '唯一标识'
    }
  }
})
const ArrayInputType = new GraphQLInputObjectType({
  name: 'ArrayInput',
  fields: () => ({
    array: {
      type: new GraphQLList(LinkDataInputType)
    }
  })
})

// const MapInputType = new GraphQLInputObjectType({
//   name: 'MapInput',
//   fields: () => ({
//     _role_: {
//       type: GraphQLString
//     },
//     map: {
//       type: GraphQLJSON
//     }
//   })
// })

const FieldType = new GraphQLInputObjectType({
  name: 'FieldType',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    type: {
      type: new GraphQLList(GraphQLString)
    }
  })
})

const SchemaType = new GraphQLInputObjectType({
  name: 'SchemaType',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    fields: {
      type: new GraphQLList(FieldType)
    }
  })
})

const buildSchemaInput = function () {
  return new GraphQLInputObjectType({
    name: 'SchemaInput',
    fields: () => ({
      types: {
        type: new GraphQLList(SchemaType)
      }
    })
  })
}
const buildInput = field => {
  const fieldType = field.type;
  switch (fieldType) {
    case 'Symbol':
    case 'Text':
    case 'Date':
      return {
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString,
        description: field.description ? field.description : field.type
      }
    case 'Boolean':
      return {
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString,
        description: field.description ? field.description : field.type
      }
    case 'Link':
      return {
        type: field.required ? new GraphQLNonNull(LinkInputType) : LinkInputType,
        description: field.description ? field.description : field.type
      }

    case 'Array': {
      if (field.items.type === 'Link') {
        if (field.items.linkType === 'Field') {
          return {
            type: field.required ? new GraphQLNonNull(new GraphQLList(FieldITC.getType()))
              : new GraphQLList(FieldITC.getType()),
            description: field.description ? field.description : field.type
          }
        }
      }
      return {
        type: field.required ? new GraphQLNonNull(new GraphQLList(FieldITC.getType()))
          : new GraphQLList(FieldITC.getType()),
        description: field.description ? field.description : field.type
      }
    }
    default:
      return {
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString,
        description: field.description ? field.description : field.type
      }
  }
}

const AuthUserInput = new GraphQLInputObjectType({
  name: 'AuthUserInput',
  fields: () => ({
    email: {type: GraphQLString},
    passsword: {type: GraphQLString}
  })
})

const buildInputs = async function () {
  const InputType = {}
  const model = await readModel('8784tvwc6dpm')
  for (const structure of model) {
    InputType[structure.name] = new GraphQLInputObjectType({
      name: `${structure.name}Input`,
      fields: () => {
        const resultFields = {
          // id: {type: GraphQLID}
          // sys: {type: SysITC.getType()}
        }
        // if (structure.type) {
        //   resultFields._value_ = buildInput(structure)
        // } else {
        Object.assign(
          resultFields,
          fromPairs(structure.fields.map(field => [field.name, buildInput(field)]))
        )
        // }
        return resultFields
      }
    })
  }
  // InputType.Schema = buildSchemaInput()
  return InputType
}

const buildDeleteObject = key =>
  new GraphQLObjectType({
    name: `${key}`,
    fields: {
      code: {type: GraphQLInt},
      message: {type: GraphQLString}
    }
  })

const tokenType = new GraphQLObjectType({
  name: 'Token',
  fields: {
    token: {type: GraphQLString},
  }
});

const buildMutation = async function (ObjectTypes) {
  console.log(ObjectTypes)
  const InputType = await buildInputs()
  const MutationObjects = {}

  const _buildMutationObjects = (objects, key, inputs) => {
    const suffixMethods = [
      'Create',
      'CreateMany',
      'UpdateById',
      'UpdateOne',
      'UpdateMany',
      'RemoveOne',
      'RemoveById',
      'RemoveMany'
    ]
    for (let method of suffixMethods) {
      if (method.includes('Create')) {
        objects[`${think._.camelCase(key)}${method}`] = {
          type: ObjectTypes[key],
          args: {...inputs},
          resolve: async (root, params, context) => {
            try {
              if (key === 'Schema') {
                return []
                // return await writeModel(params)
              }
              return await writeEntry(key, params[key.toLowerCase()], context)
            } catch (error) {
              throw error
            }
          }
        }
      }
      if (method.includes('Remove')) {
        MutationObjects[`${think._.camelCase(key)}${method}`] = {
          type: buildDeleteObject(`${method}${key}Payload`),
          args: {...inputs},
          resolve: async (root, params, context) => {
            try {
              if (key === 'Schema') {
                return []
              }
              return await deleteEntry(key, params[key.toLowerCase()], context)
            } catch (error) {
              throw error
            }
          }
        }
      }
      if (method.includes('Update')) {
      }
    }

  }
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => {
      MutationObjects.login = {
        type: tokenType,
        name: 'LoginMutation',
        args: {
          email: {
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          }
        },
        // args: {user: {type: AuthUserInput}},
        fields: {
          email: {
            type: GraphQLString
          },
          password: {
            type: GraphQLString
          }
        },
        resolve: async (root, input, context) => {
          // const data = params.user
          const userLogin = input.email;

          const userModel = think.model('users');
          const userInfo = await userModel.where({email: userLogin}).find();
          // 验证用户是否存在
          if (think.isEmpty(userInfo)) {
            throw new Error('ACCOUNT_NOT_FOUND')
          }
          // 帐号是否被禁用
          if (userInfo.deleted === 1) {
            throw new Error('ACCOUNT_FORBIDDEN');
          }

          // 校验密码
          if (!userModel.checkPassword(userInfo.password, input.password)) {
            throw new Error('ACCOUNT_PASSWORD_ERROR');
          }
          const token = await think.service('authService').generateToken({
            id: userInfo.id
          })
          return token
        }
      }

      Object.keys(InputType).forEach(key => {
        const inputs = {
          // sys: {type: SysITC.getType()}
          recordId: {type: GraphQLID}
        }

        inputs.record = {type: new GraphQLNonNull(InputType[key])}
        inputs.type = {type: new GraphQLNonNull(LinkETC.getType())}
        _buildMutationObjects(MutationObjects, key, inputs)
        /*        MutationObjects[`${think._.camelCase(key)}Create`] = {
                  type: ObjectTypes[key],
                  args: {...inputs},
                  resolve: async (root, params, context) => {
                    try {
                      if (key === 'Schema') {
                        return []
                        // return await writeModel(params)
                      }
                      return await writeEntry(key, params[key.toLowerCase()], context)
                    } catch (error) {
                      throw error
                    }
                  }
                }
                MutationObjects[`${key}CreateMany`] = {
                  type: ObjectTypes[key],
                  args: {...inputs},
                  resolve: async (root, params, context) => {
                    try {
                      if (key === 'Schema') {
                        return []
                        // return await writeModel(params)
                      }
                      return await writeEntry(key, params[key.toLowerCase()], context)
                    } catch (error) {
                      throw error
                    }
                  }
                }
                MutationObjects[`${key}UpdateById`] = {
                  type: ObjectTypes[key],
                  args: {...inputs},
                  resolve: async (root, params, context) => {
                    try {
                      if (key === 'Schema') {
                        return []
                        // return await writeModel(params)
                      }
                      return await writeEntry(key, params[key.toLowerCase()], context)
                    } catch (error) {
                      throw error
                    }
                  }
                }
                MutationObjects[`${key}UpdateOne`] = {
                  type: ObjectTypes[key],
                  args: {...inputs},
                  resolve: async (root, params, context) => {
                    try {
                      if (key === 'Schema') {
                        return []
                        // return await writeModel(params)
                      }
                      return await writeEntry(key, params[key.toLowerCase()], context)
                    } catch (error) {
                      throw error
                    }
                  }
                }

                MutationObjects[`${key}UpdateMany`] = {
                  type: ObjectTypes[key],
                  args: {...inputs},
                  resolve: async (root, params, context) => {
                    try {
                      if (key === 'Schema') {
                        return []
                        // return await writeModel(params)
                      }
                      return await writeEntry(key, params[key.toLowerCase()], context)
                    } catch (error) {
                      throw error
                    }
                  }
                }

                MutationObjects[`${key}RemoveById`] = {
                  type: buildDeleteObject(key),
                  args: {...inputs},
                  resolve: async (root, params, context) => {
                    try {
                      if (key === 'Schema') {
                        return []
                      }
                      return await deleteEntry(key, params[key.toLowerCase()], context)
                    } catch (error) {
                      throw error
                    }
                  }
                // }
                // MutationObjects[`${key}RemoveByOne`] = {
                //   type: buildDeleteObject(key),
                //   args: {...inputs},
                //   resolve: async (root, params, context) => {
                //     try {
                //       if (key === 'Schema') {
                //         return []
                //       }
                //       return await deleteEntry(key, params[key.toLowerCase()], context)
                //     } catch (error) {
                //       throw error
                //     }
                //   }
                // }
                // MutationObjects[`${key}RemoveByMany`] = {
                //   type: buildDeleteObject(key),
                //   args: {...inputs},
                //   resolve: async (root, params, context) => {
                //     try {
                //       if (key === 'Schema') {
                //         return []
                //       }
                //       return await deleteEntry(key, params[key.toLowerCase()], context)
                //     } catch (error) {
                //       throw error
                //     }
                //   }
                }*/

      })
      return MutationObjects
    }
  })
  return mutation
}

module.exports = {
  buildMutation
}
