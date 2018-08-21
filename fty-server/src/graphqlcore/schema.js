const {GraphQLSchema} = require('graphql')
const {buildObjects, buildQuery} = require('./query')
const {buildMutation} = require('./mutation')

const buildSchema = async function () {
  const objectTypes = await buildObjects()
  const queryType = await buildQuery(objectTypes)
  const mutationType = await buildMutation(objectTypes)
  return new GraphQLSchema({
    query: queryType,
    mutation: mutationType
  })
}
