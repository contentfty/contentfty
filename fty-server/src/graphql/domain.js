const typeDef = `
  type Org {
    id: Int!
    domain: String
    subdomain: String
  }
  extend type Query {
    orgList: [Org]
  }
`;

const resolvers = {
  Query: {
    orgList: async (prev, args, context) => {
      const orgModel = think.model('orgs');
      const orgs = await orgModel.list();
      return orgs;
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
