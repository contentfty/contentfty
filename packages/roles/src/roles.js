const projectRoles = {
  PM: 'PM',
  Developer: 'Developer',
  Collaborator: 'Collaborator',
  Editor: 'Editor'
}

const orgRoles = {
  Admin: 'Admin',
  Owner: 'Owner',
  Member: 'Member',
}

const allRoles = [
  ...Object.keys(projectRoles)
    .map(k => projectRoles[k]),
  ...Object.keys(orgRoles)
    .map(k => orgRoles[k])
]

const allRolesMap = Object.assign({}, projectRoles, orgRoles)


module.exports = {
  orgRoles,
  projectRoles,
  roles: allRoles,
  rolesMap: allRolesMap
}
