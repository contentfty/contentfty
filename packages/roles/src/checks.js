const { roleToPolicyMap } = require('./helpers')
const { actions } = require('./actions')

const isAllowed = (action, role) => {
  if (typeof role !== 'string') {
    throw new Error(`Role must be a string, got: ${JSON.stringify(role)} which is a: ${typeof role}`)
  }
  if (typeof action !== 'string') {
    throw new Error(`Action must be a string, got: ${JSON.stringify(action)} which is a: ${typeof action}`)
  }
  const policies = roleToPolicyMap[role]
  const actionPolicy = actions[action]

  if (!actionPolicy) {
    throw new Error(`Given action: ${action} does not have a policy`)
  }

  if (!policies) {
    return false
  }

  return policies.indexOf(actionPolicy) > -1
}

module.exports = {isAllowed}
