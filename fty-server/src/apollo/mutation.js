const {isString, fromPairs} = require('lodash')

const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString
} = require('graphql')

const GraphQLJSON = require('graphql-type-json')

const {writeEntry} = require('./db/write')
const {deleteEntry} = require('./db/delete')
const {readModel, writeModel} = require('./db/model')

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
    _role_: {
      type: GraphQLString
    },
    link: {
      type: LinkDataInputType
    }
  })
})

const LinksInputType = new GraphQLInputObjectType({
  name: 'LinkInput',
  fields: () => ({
    _role_: {
      type: GraphQLString
    },
    links: {
      type: new GraphQLList(LinkDataInputType)
    }
  })
})

const MapInputType = new GraphQLInputObjectType({
  name: 'MapInput',
  fields: () => ({
    _role_: {
      type: GraphQLString
    },
    map: {
      type: GraphQLJSON
    }
  })
})

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
  if (isString(field.type)) {
    field.type = [field.type]
  }
  switch (field.type[0]) {
    case 'link':
      return {type: LinkInputType}
    case 'links':
      return {type: LinksInputType}
    case 'map':
      return {type: MapInputType}
    case 'json':
      return {type: GraphQLJSON}
    default:
      return {type: GraphQLString}
  }
}

const buildInputs = async function () {
  const InputType = {}
  const model = await readModel()
  for (const structure of model) {
    InputType[structure.name] = new GraphQLInputObjectType({
      name: `${structure.name}Input`,
      fields: () => {
        const resultFields = {
          id: {type: GraphQLID}
        }
        if (structure.type) {
          resultFields._value_ = buildInput(structure)
        } else {
          Object.assign(
            resultFields,
            fromPairs(structure.fields.map(field => [field.name, buildInput(field)]))
          )
        }
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
      _id_: {type: GraphQLID},
      message: {type: GraphQLString}
    }
  })

const buildMutation = async function (ObjectTypes) {
  const InputType = await buildInputs()
  const MutationObjects = {}
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => {
      Object.keys(InputType).forEach(key => {
        const inputs = {}
        inputs[key.toLowerCase()] = {type: InputType[key]}
        MutationObjects[`create${key}`] = {
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
            // try {
            return []
            // 业务服务管理接口
            // return await deleteEntry(key, params[key.toLowerCase()])
            // } catch (error) {
            //   throw error
            // }
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
