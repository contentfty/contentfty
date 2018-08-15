const typeDef = `
  type Post {
    id: Int!
    author: [Author]
    groupId: Int!
    name: String!
    handle: String!
    context: String!
    instructions: String!
    type: String!
    settings: String!
    uid: String!
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
