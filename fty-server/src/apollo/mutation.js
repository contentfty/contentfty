const {isString, fromPairs} = require('lodash')
const { FieldITC } = require('./types/inputTypes')

const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

const {writeEntry} = require('./db/write')
const {deleteEntry} = require('./db/delete')
const {readModel, writeModel} = require('./db/model')

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

  const _buildMutationObjects = (objects, type) => {
    const camelKey = think._.camelCase(type)

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
      let inputs = {
        // sys: {type: SysITC.getType()}
        recordId: {type: GraphQLID}
      }
      if (method.includes('Many')) {
        inputs = think._.assign(inputs, {
          records: {type: new GraphQLNonNull(new GraphQLList(InputType[type]))}
        })
      } else {
        inputs = think._.assign(inputs, {
          record: {type: new GraphQLNonNull(InputType[type])}
        })
      }

      if (method.includes('Create')) {
        Reflect.deleteProperty(inputs, 'recordId')
        if (type === 'ContentType') {
          Reflect.deleteProperty(inputs, 'type')
        }
        objects[`${camelKey}${method}`] = {
          type: ObjectTypes[type],
          args: {...inputs},
          resolve: async (root, args, context) => {
            try {
              return await writeEntry(type, method, args, context)
            } catch (error) {
              throw error
            }
          }
        }
      }
      if (method.includes('Update')) {
        Reflect.deleteProperty(inputs, 'type')
        objects[`${camelKey}${method}`] = {
          type: ObjectTypes[type],
          args: {...inputs},
          resolve: async (root, params, context) => {
            try {
              return await writeEntry(type, params, context)
            } catch (error) {
              throw error
            }
          }
        }
      }
      if (method.includes('Remove')) {
        MutationObjects[`${camelKey}${method}`] = {
          type: buildDeleteObject(`${method}${type}Payload`),
          args: {...inputs},
          resolve: async (root, params, context) => {
            try {
              return await deleteEntry(type, params[type.toLowerCase()], context)
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
        _buildMutationObjects(MutationObjects, key)
      })
      return MutationObjects
    }
  })
  return mutation
}

module.exports = {
  buildMutation
}
