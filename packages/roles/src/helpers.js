const policies = require('./policies')
const { rolesMap } = require('./roles')

const roleToPolicyMap = {
  PM: policies.pmPolicies().policies,
  Developer: policies.developerPolicies().policies,
  Collaborator: policies.collaboratorPolicies().policies,
  Editor: policies.editorPolicies().policies,
  Owner: policies.ownerPolicies().policies,
  Member: policies.memberPolicies().policies,
  Admin: policies.adminPolicies().policies
}

const roleToPolicies = (role) => roleToPolicyMap[role] || []

module.exports = {roleToPolicies, roleToPolicyMap}
