const {typeDef: Field, resolvers: fieldResolvers} = require('./field')
const {typeDef: Org, resolvers: orgResolvers} = require('./org')
const {typeDef: Auth, resolvers: authResolvers} = require('./auth')
const {typeDef: User, resolvers: userResolvers} = require('./users')
const {typeDef: Space, resolvers: spaceResolvers} = require('./space')

const {makeExecutableSchema} = require('graphql-tools');
const Scalar = `
  scalar Date
`
const Query = `
  type Query {
    _empty: String
  }
  type Mutation
`;
const resolvers = {};

module.exports = makeExecutableSchema({
  typeDefs: [
    Scalar,
    Query,
    Field,
    Org,
    Auth,
    User,
    Space
  ],
  resolvers: think._.merge(
    resolvers,
    fieldResolvers,
    orgResolvers,
    authResolvers,
    userResolvers,
    spaceResolvers)
});
