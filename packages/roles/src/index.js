const { policies } = require('./policies')
const { roles, rolesMap, orgRoles, projectRoles } = require('./roles')
const { actions, actionsMap } = require('./actions')
const { isAllowed } = require('./checks')

module.exports = {
  isAllowed,
  actions,
  allActions: actionsMap,
  rolesList: roles,
  roles: rolesMap,
  orgRoles,
  projectRoles,
  policies
}
