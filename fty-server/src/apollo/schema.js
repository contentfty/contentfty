const {GraphQLSchema} = require('graphql')
const {buildObjects, buildQuery} = require('./query')
const {buildMutation} = require('./mutation')

/**
 * 构建 Schema
 * @returns {Promise<GraphQLSchema>}
 */
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
