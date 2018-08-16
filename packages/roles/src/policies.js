const { orgRoles, projectRoles } = require('./roles')

const policies = ['Org', 'Project', 'Model', 'Content']
.reduce((result, type) => {
  const actions = {
    'create': `Create${type}`,
    'read': `Read${type}`,
    'update': `Update${type}`,
    'delete': `Delete${type}`
  }

  if (type === 'Content') {
    actions['publish'] = `Publish`
  }

  if (type === 'Org') {
    actions['subscription'] = `Subscription`
  }

  if (/(Org|Project)/gi.test(type)) {
    actions['removeUser'] = `Remove${type}User`
    actions['invite'] = `Invite${type}`
  }

  result[type] = { type, actions }
  return result
}, {})

const setPolicies = (resource, actions) => {
  return actions.reduce((results, action) => {
    results.push(policies[resource].actions[action])
    return results
  }, [])
    .filter(Boolean)
}


const pmPolicies = () => {
  return {
    name: projectRoles.PM,
    policies: [
      ...setPolicies('Org', ['read', 'invite']),
      ...setPolicies('Project', ['read', 'update', 'invite']),
      ...setPolicies('Model', ['create', 'read', 'update', 'delete']),
      ...setPolicies('Content', ['create', 'read', 'update', 'delete', 'publish'])
    ]
  }
}

const developerPolicies = () => ({
  name: projectRoles.Developer,
  policies: [
    ...setPolicies('Org', ['read']),
    ...setPolicies('Project', ['read']),
    ...setPolicies('Model', ['create', 'read', 'update', 'delete']),
    ...setPolicies('Content', ['create', 'read', 'update', 'delete', 'publish'])
  ]
})

const collaboratorPolicies = () => ({
  name: projectRoles.Collborator,
  policies: [
    ...setPolicies('Org', ['read']),
    ...setPolicies('Project', ['read']),
    ...setPolicies('Model', ['read']),
    ...setPolicies('Content', ['create', 'read', 'update'])
  ]
})


const editorPolicies = () => ({
  name: projectRoles.Editor,
  policies: [
    ...setPolicies('Org', ['read']),
    ...setPolicies('Project', ['read']),
    ...setPolicies('Model', ['create', 'read', 'update', 'delete']),
    ...setPolicies('Content', ['create', 'read', 'update', 'delete', 'publish'])
  ]
})


const adminPolicies = () => ({
  name: orgRoles.Admin,
  policies: [
    ...setPolicies('Org', [
      'read',
      'update',
      'invite',
      'removeUser',
      'subscription'
    ]),

    ...setPolicies('Project', [
      'create',
      'read',
      'delete',
      'update',
      'removeUser',
      'invite'
    ]),

    ...setPolicies('Model', [
      'create',
      'update',
      'delete',
      'read'
    ]),

    ...setPolicies('Content', [
      'create',
      'read',
      'update',
      'delete',
      'publish'
    ])
  ]
})

const ownerPolicies = () => ({
  name: orgRoles.Owner,
  policies: [
    ...setPolicies('Org', [
      'read',
      'update',
      'delete',
      'invite',
      'removeUser',
      'subscription'
    ]),

    ...setPolicies('Project', [
      'create',
      'read',
      'delete',
      'update',
      'removeUser',
      'invite'
    ]),

    ...setPolicies('Model', [
      'create',
      'update',
      'delete',
      'read'
    ]),

    ...setPolicies('Content', [
      'create',
      'read',
      'update',
      'delete',
      'publish'
    ])
  ]
})

const memberPolicies = () => ({
  name: orgRoles.Member,
  policies: [
    ...setPolicies('Org', ['read'])
  ]
})

module.exports = {
  pmPolicies,
  developerPolicies,
  collaboratorPolicies,
  editorPolicies,
  adminPolicies,
  ownerPolicies,
  memberPolicies,
  policies,
  setPolicies
}
