const GraphQLJSON = require('graphql-type-json')

const {typeDef: Field, resolvers: fieldResolvers} = require('./field')
const {typeDef: ContentType, resolvers: contentTypeResolvers} = require('./contentType')
const {typeDef: Org, resolvers: orgResolvers} = require('./org')
const {typeDef: Auth, resolvers: authResolvers} = require('./auth')
const {typeDef: User, resolvers: userResolvers} = require('./users')
const {typeDef: Space, resolvers: spaceResolvers} = require('./space')
const {typeDef: Entry, resolvers: entryResolvers} = require('./entry')

const {makeExecutableSchema} = require('graphql-tools');
const Scalar = `
  scalar Date
  scalar JSON
`
const Query = `
  type Query {
    _empty: String
  }
  type Mutation
`;
const resolvers = {
  JSON: GraphQLJSON
};

module.exports = makeExecutableSchema({
  typeDefs: [
    Scalar,
    Query,
    Field,
    ContentType,
    Org,
    Auth,
    User,
    Space,
    Entry
  ],
  resolvers: think._.merge(
    resolvers,
    fieldResolvers,
    contentTypeResolvers,
    orgResolvers,
    authResolvers,
    userResolvers,
    spaceResolvers,
    entryResolvers
  )
});

// console.log(Schema)
// module.exports = {
//   Schema
// }
