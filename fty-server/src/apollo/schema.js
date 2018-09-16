const {GQC, TypeComposer, InputTypeComposer, EnumTypeComposer, Resolver} = require('graphql-compose')
// const {composeWithPagination} = require('graphql-compose-pagination')

const {UserTC} = require('./tc/user')
// composeWithPagination(UserTC, {
//   findResolverName: 'findMany'
// });

GQC.Query.addFields({
  userPagination: UserTC.getResolver('pagination'),
  userById: UserTC.getResolver('byId'),
  userOne: UserTC.getResolver('one'),
})

module.exports = {
  buildSchema: GQC.buildSchema()
}

// const {SchemaComposer} = require('graphql-compose')
// import { SchemaComposer } from 'graphql-compose';

/*
const {GraphQLSchema} = require('graphql')
const {buildObjects, buildQuery} = require('./query')
const {buildMutation} = require('./mutation')

/!**
 * 构建 Schema
 * @returns {Promise<GraphQLSchema>}
 *!/
const buildSchema = async function (spaceId) {
  const objectTypes = await buildObjects(spaceId)
  const queryType = await buildQuery(objectTypes)
  const mutationType = await buildMutation(objectTypes)
  const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
  })
  return schema
}

module.exports = {
  buildSchema
}
*/
