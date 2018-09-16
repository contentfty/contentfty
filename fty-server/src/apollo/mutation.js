const {isString, fromPairs} = require('lodash')

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

const fieldType = new GraphQLEnumType({
  name: 'FieldType',
  values: {
    Symbol: {value: 'symbol'},
    Text: {value: 'text'},
    Integer: {value: 'integer'},
    Number: {value: 'number'},
    Date: {value: 'date'},
    Location: {value: 'location'},
    Boolean: {value: 'boolean'},
    Link: {value: 'link'},
    Array: {value: 'array'},
    Object: {value: 'object'}
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
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString
      }
    case 'Boolean':
      return {
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString
      }
    case 'Link':
      return {
        type: field.required ? new GraphQLNonNull(LinkInputType) : LinkInputType

      }

    case 'Array': {
      // if (field.items.type === 'Link') {
      //   if (field.items.linkType === 'Entry') {
      //     if (field.items.validations.length > 0) {
      //       for (let linkContentType of field.items.validations) {
      //
      //       }
      //     }
      //   }
      // }
      return {
        type: field.required ? new GraphQLNonNull(new GraphQLList(LinkInputType))
          : new GraphQLList(LinkInputType)
      }
    }
    default:
      return {
        type: field.required ? new GraphQLNonNull(GraphQLString) : GraphQLString
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
          id: {type: GraphQLID}
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
  InputType.Schema = buildSchemaInput()
  return InputType
}

const buildDeleteObject = key =>
  new GraphQLObjectType({
    name: `_DeleteObject${key}_`,
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
        const inputs = {}
        inputs[key.toLowerCase()] = {type: InputType[key]}
        MutationObjects[`save${key}`] = {
          type: ObjectTypes[key],
          args: {...inputs},
          resolve: async (root, params, context) => {
            try {
              if (key === 'Schema') {
                return []
                // return await writeModel(params)
              }
              // const user = context
              // return []
              return await writeEntry(key, params[key.toLowerCase()], context)
            } catch (error) {
              throw error
            }
          }
        }

        MutationObjects[`delete${key}`] = {
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
        }

      })
      return MutationObjects
    }
  })
  return mutation
}

module.exports = {
  buildMutation
}
