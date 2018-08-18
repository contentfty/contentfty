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
      const oneData = await entryTypeModel.getById(args.id)
      return oneData
    },
    entryTypeList: async (prev, args, context) => {
      const fieldModel = think.model('fields', {spaceId: context.spaceId});
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
