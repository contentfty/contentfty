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

// const GraphQLJSON = require('graphql-type-json')

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
  description: '正则表达式验证规则',
  fields: {
    pattern: {
      type: 'String!',
      description: '正则字符'
    }
  }
})

const _SizeITC = InputTypeComposer.create({
  name: 'Size',
  description: '字段大小限制',
  fields: {
    min: {
      type: 'Int',
      description: '最小值'
    },
    max: {
      type: 'Int',
      description: '最大值'
    }
  }
})
// 验证输入
const ValidationITC = InputTypeComposer.create({
  name: 'ValidationInput',
  description: '验证信息输入',
  fields: {
    size: _SizeITC,
    regexp: _RegexpITC,
    in: {
      type: '[String]',
      description: '选项规则,例如多个 Tag'
    },
    linkContentType: {
      type: '[String]',
      description: '引用关系的内容类型'
    },
    message: {
      type: 'String',
      description: '字段信息'
    }
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
      description: '不允许汉字与特殊字符, 字段唯一标识'
    },
    title: {
      type: 'String',
      description: '字段标题, 可用于生成 name'
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
    password: {type: GraphQLString}
  })
})

const buildInputs = async function () {
  const InputType = {}
  const model = await readModel('8784tvwc6dpm')
  for (const structure of model) {
    InputType[structure.id] = new GraphQLInputObjectType({
      name: `${structure.id}Input`,
      fields: () => {
        return fromPairs(structure.fields.map(field => [field.name, buildInput(field)]))
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
        Reflect.deleteProperty(inputs, 'recordId')
        if (key === 'ContentType') {
          Reflect.deleteProperty(inputs, 'type')
        }
        objects[`${think._.camelCase(key)}${method}`] = {
          type: ObjectTypes[key],
          args: {...inputs},
          resolve: async (root, params, context) => {
            try {
              return await writeEntry(key, params, context)
            } catch (error) {
              throw error
            }
          }
        }
      }
      if (method.includes('Update')) {
        Reflect.deleteProperty(inputs, 'type')
        // if (key === 'ContentType') {
        // Reflect.deleteProperty(inputs, 'recordId')
        // Reflect.deleteProperty(inputs, 'type')
        // }
        objects[`${think._.camelCase(key)}${method}`] = {
          type: ObjectTypes[key],
          args: {...inputs},
          resolve: async (root, params, context) => {
            try {
              return await writeEntry(key, params, context)
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
      })
      return MutationObjects
    }
  })
  return mutation
}

module.exports = {
  buildMutation
}
