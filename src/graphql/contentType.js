/* eslint-disable no-undef */
const typeDef = `
  type EntryType {
    id: String!
    name: String!
    fields: [Field]
    createdBy: User
    updatedBy: User
    createdAt: String
    updatedAt: String
  }
  extend type Query {
    entryType(id: String): EntryType
    entryTypeList(groupId: Int!): [EntryType]
  }
  
  input EntryTypeInput {
    id: String!
    name: String!
    #fields: [FieldInput]
  }
  
  extend type Mutation {
    createContentType(entryType: EntryTypeInput):EntryType
  }
`;

const resolvers = {
  Query: {
    entryType: async (prev, args, context) => {
      const entryTypeModel = think.model('entrytypes', {spaceId: context.spaceId})
      const typeId = args.id
      const oneData = await entryTypeModel.where({id: typeId}).find()
      oneData.createdBy = await think.model('users').where({id: context.user.id}).find()
      oneData.updatedBy = await think.model('users').where({id: context.user.id}).find()

      const fieldModel = think.model('fields', {spaceId: context.spaceId})
      oneData.fields = JSON.parse(oneData.fields)
      if (oneData.fields.length > 0) {
        const fieldsList = await fieldModel.where({
          id: ['IN', oneData.fields],
          typeId: typeId
        }).select()
        oneData.fields = fieldsList
      }
      return oneData
    },
    entryTypeList: async (prev, args, context) => {
      const fieldModel = think.model('fields', {appId: context.appId});
      const fields = await fieldModel.findByGroupId(args.groupId);
      return fields;
    }
  },
  Mutation: {
    createContentType: async (prev, args, context) => {
      const entryTypeModel = think.model('entrytypes', {spaceId: context.spaceId})
      const entryType = args.entryType
      const newType = await entryTypeModel.save(entryType, context.user.id)
      return newType
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
