const typeDef = `
  type Entry {
    id: Int
    env: String
    typeId: String
    createdBy: User
    updatedBy: User
    publishedAt: String
    createdAt: String
    updatedAt: String
    displayField: String
    locale: String
    name: String
    data: [Field]
  }
  extend type Query {
    fieldList(groupId: Int!): [Field]
  }
`;

const resolvers = {
  Query: {
    fieldList: async (prev, args, context) => {
      const fieldModel = think.model('fields', {appId: context.appId});
      const fields = await fieldModel.findByGroupId(args.groupId);
      return fields;
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
