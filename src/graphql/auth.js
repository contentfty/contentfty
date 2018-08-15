const typeDef = `
  input AuthInput {
    username: String!
    password: String! 
  }
  type Auth {
    token: String!
  }
  extend type Query {
    getAuthToken(auth: AuthInput): Auth
  }
`;
const resolvers = {
  Query: {
    getAuthToken: async (prev, args, context) => {
      const auth = args.auth
      const token = await think.service('auth_service').createToken(auth.username, auth.password)
      return token
    }
  }
}

module.exports = {
  typeDef,
  resolvers
}
