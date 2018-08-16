const { policies } = require('./policies')

const actions = {
  'org:create': policies.Org.actions['create'],
  'org:read': policies.Org.actions['read'],
  'org:update': policies.Org.actions['update'],
  'org:delete': policies.Org.actions['delete'],
  'org:subscription': policies.Org.actions['subscription'],
  'org:invite': policies.Org.actions['invite'],
  'org:removeUser': policies.Org.actions['removeUser'],

  'project:create': policies.Project.actions['create'],
  'project:read': policies.Project.actions['read'],
  'project:update': policies.Project.actions['update'],
  'project:delete': policies.Project.actions['delete'],
  'project:removeUser': policies.Project.actions['removeUser'],
  'project:invite': policies.Project.actions['invite'],

  'model:create': policies.Model.actions['create'],
  'model:read': policies.Model.actions['read'],
  'model:update': policies.Model.actions['update'],
  'model:delete': policies.Model.actions['delete'],

  'content:create': policies.Content.actions['create'],
  'content:read': policies.Content.actions['read'],
  'content:update': policies.Content.actions['update'],
  'content:delete': policies.Content.actions['delete'],
  'content:publish': policies.Content.actions['publish']
}

const actionsMap = {
  org: {
    create: 'org:create',
    read: 'org:read',
    update: 'org:update',
    delete: 'org:delete',
    subscription: 'org:subscription',
    invite: 'org:invite',
    removeUser: 'org:removeUser'
  },
  project: {
    create: 'project:create',
    read: 'project:read',
    update: 'project:update',
    delete: 'project:delete',
    removeUser: 'project:removeUser',
    invite: 'project:invite'
  },
  model: {
    create: 'model:create',
    read: 'model:read',
    update: 'model:update',
    delete: 'model:delete'
  },
  content: {
    create: 'content:create',
    read: 'content:read',
    update: 'content:update',
    delete: 'content:delete',
    publish: 'content:publish'
  }
}

module.exports = {
  actions,
  actionsMap
}
