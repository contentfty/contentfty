const { orgRoles, projectRoles, roles, rolesMap } = require('./roles')
const { policies, setPolicies } = require('./policies')
const { isAllowed } = require('./checks')
const { actionsMap } = require('./actions')

describe('roles', () => {
  test('has correct project roles', () => {
    expect(projectRoles)
      .toEqual({
        PM: 'PM',
        Developer: 'Developer',
        Collaborator: 'Collaborator',
        Editor: 'Editor'
      })
  })

  test('has correct org roles', () => {
    expect(orgRoles)
      .toEqual({
        Admin: 'Admin',
        Owner: 'Owner',
        Member: 'Member',
      })
  })

  test('has all roles', () => {
    expect(roles)
      .toEqual([
        'PM',
        'Developer',
        'Collaborator',
        'Editor',
        'Admin',
        'Owner',
        'Member',
      ])
  })

  test('merges all roles', () => {
    expect(rolesMap)
      .toEqual({
        PM: 'PM',
        Developer: 'Developer',
        Collaborator: 'Collaborator',
        Editor: 'Editor',
        Admin: 'Admin',
        Owner: 'Owner',
        Member: 'Member'
      })
  })
})

describe('policies', () => {
  test('created policies for all resources', () => {
    expect(policies).toHaveProperty('Org')
    expect(policies).toHaveProperty('Project')
    expect(policies).toHaveProperty('Model')
    expect(policies).toHaveProperty('Content')
  })

  test('created org policies', () => {
    expect(policies.Org.actions).toHaveProperty('create')
    expect(policies.Org.actions).toHaveProperty('read')
    expect(policies.Org.actions).toHaveProperty('update')
    expect(policies.Org.actions).toHaveProperty('delete')
    expect(policies.Org.actions).toHaveProperty('subscription')
    expect(policies.Org.actions).toHaveProperty('removeUser')
    expect(policies.Org.actions).toHaveProperty('invite')
    expect(policies.Org.actions).not.toHaveProperty('publish')
  })

  test('created project policies', () => {
    expect(policies.Project.actions).toHaveProperty('create')
    expect(policies.Project.actions).toHaveProperty('read')
    expect(policies.Project.actions).toHaveProperty('update')
    expect(policies.Project.actions).toHaveProperty('delete')
    expect(policies.Project.actions).toHaveProperty('removeUser')
    expect(policies.Project.actions).toHaveProperty('invite')

    expect(policies.Project.actions).not.toHaveProperty('subsciption')
    expect(policies.Project.actions).not.toHaveProperty('publish')
  })

  test('created Model policies', () => {
    expect(policies.Model.actions).toHaveProperty('create')
    expect(policies.Model.actions).toHaveProperty('read')
    expect(policies.Model.actions).toHaveProperty('update')
    expect(policies.Model.actions).toHaveProperty('delete')

    expect(policies.Model.actions).not.toHaveProperty('invite')
    expect(policies.Model.actions).not.toHaveProperty('subsciption')
    expect(policies.Model.actions).not.toHaveProperty('publish')
  })

  test('created Content policies', () => {
    expect(policies.Content.actions).toHaveProperty('create')
    expect(policies.Content.actions).toHaveProperty('read')
    expect(policies.Content.actions).toHaveProperty('update')
    expect(policies.Content.actions).toHaveProperty('delete')
    expect(policies.Content.actions).toHaveProperty('publish')

    expect(policies.Content.actions).not.toHaveProperty('invite')
    expect(policies.Content.actions).not.toHaveProperty('subsciption')
  })

  test('gets policies for actions and resource', () => {
    let policies = setPolicies('Org', ['create', 'read'])
    expect(policies).toEqual(['CreateOrg', 'ReadOrg'])

    policies = setPolicies('Model', ['invite', 'create'])
    expect(policies.length).toBe(1)
  })
})

describe('isAllowed: Org', () => {
  test('throws error if no matching action', () => {
    expect(() => isAllowed('fakeaction', 'member'))
      .toThrow()
  })

  test('Owner access', () => {
    expect(isAllowed(actionsMap.org.read, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.org.update, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.org.delete, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.org.subscription, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.org.invite, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.org.removeUser, 'Owner')).toBe(true)
  })

  test('Admin access', () => {
    expect(isAllowed(actionsMap.org.read, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.org.update, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.org.delete, 'Admin')).toBe(false)
    expect(isAllowed(actionsMap.org.subscription, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.org.invite, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.org.removeUser, 'Admin')).toBe(true)
  })

  test('Member access', () => {
    expect(isAllowed(actionsMap.org.read, 'Member')).toBe(true)
    expect(isAllowed(actionsMap.org.update, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.org.delete, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.org.subscription, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.org.invite, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.org.removeUser, 'Member')).toBe(false)
  })

  test('PM access', () => {
    expect(isAllowed(actionsMap.org.read, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.org.update, 'PM')).toBe(false)
    expect(isAllowed(actionsMap.org.delete, 'PM')).toBe(false)
    expect(isAllowed(actionsMap.org.subscription, 'PM')).toBe(false)
    expect(isAllowed(actionsMap.org.invite, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.org.removeUser, 'PM')).toBe(false)
  })

  test('Developer access', () => {
    expect(isAllowed(actionsMap.org.read, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.org.update, 'Developer')).toBe(false)
    expect(isAllowed(actionsMap.org.delete, 'Developer')).toBe(false)
    expect(isAllowed(actionsMap.org.subscription, 'Developer')).toBe(false)
    expect(isAllowed(actionsMap.org.invite, 'Developer')).toBe(false)
    expect(isAllowed(actionsMap.org.removeUser, 'Developer')).toBe(false)
  })

  test('Collaborator access', () => {
    expect(isAllowed(actionsMap.org.read, 'Collaborator')).toBe(true)
    expect(isAllowed(actionsMap.org.update, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.org.delete, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.org.subscription, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.org.invite, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.org.removeUser, 'Collaborator')).toBe(false)
  })

  test('Editor access', () => {
    expect(isAllowed(actionsMap.org.read, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.org.update, 'Editor')).toBe(false)
    expect(isAllowed(actionsMap.org.delete, 'Editor')).toBe(false)
    expect(isAllowed(actionsMap.org.subscription, 'Editor')).toBe(false)
    expect(isAllowed(actionsMap.org.invite, 'Editor')).toBe(false)
    expect(isAllowed(actionsMap.org.removeUser, 'Editor')).toBe(false)
  })
})

describe('isAllowed: Project', () => {
  test('Owner access', () => {
    expect(isAllowed(actionsMap.project.create, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.project.read, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.project.delete, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.project.invite, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.project.removeUser, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.project.update, 'Owner')).toBe(true)
  })

  test('Admin access', () => {
    expect(isAllowed(actionsMap.project.create, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.project.read, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.project.delete, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.project.invite, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.project.removeUser, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.project.update, 'Admin')).toBe(true)
  })

  test('Member access', () => {
    expect(isAllowed(actionsMap.project.create, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.project.read, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.project.delete, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.project.invite, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.project.removeUser, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.project.update, 'Member')).toBe(false)
  })

  test('PM access', () => {
    expect(isAllowed(actionsMap.project.create, 'PM')).toBe(false)
    expect(isAllowed(actionsMap.project.read, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.project.delete, 'PM')).toBe(false)
    expect(isAllowed(actionsMap.project.invite, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.project.removeUser, 'PM')).toBe(false)
    expect(isAllowed(actionsMap.project.update, 'PM')).toBe(true)
  })

  test('Developer access', () => {
    expect(isAllowed(actionsMap.project.create, 'Developer')).toBe(false)
    expect(isAllowed(actionsMap.project.read, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.project.delete, 'Developer')).toBe(false)
    expect(isAllowed(actionsMap.project.invite, 'Developer')).toBe(false)
    expect(isAllowed(actionsMap.project.removeUser, 'Developer')).toBe(false)
    expect(isAllowed(actionsMap.project.update, 'Developer')).toBe(false)
  })

  test('Collaborator access', () => {
    expect(isAllowed(actionsMap.project.create, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.project.read, 'Collaborator')).toBe(true)
    expect(isAllowed(actionsMap.project.delete, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.project.invite, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.project.removeUser, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.project.update, 'Collaborator')).toBe(false)
  })

  test('Editor access', () => {
    expect(isAllowed(actionsMap.project.create, 'Editor')).toBe(false)
    expect(isAllowed(actionsMap.project.read, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.project.delete, 'Editor')).toBe(false)
    expect(isAllowed(actionsMap.project.invite, 'Editor')).toBe(false)
    expect(isAllowed(actionsMap.project.removeUser, 'Editor')).toBe(false)
    expect(isAllowed(actionsMap.project.update, 'Editor')).toBe(false)
  })

})

describe('isAllowed: Model', () => {
  test('Owner access', () => {
    expect(isAllowed(actionsMap.model.create, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.model.read, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.model.delete, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.model.update, 'Owner')).toBe(true)
  })

  test('Admin access', () => {
    expect(isAllowed(actionsMap.model.create, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.model.read, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.model.delete, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.model.update, 'Admin')).toBe(true)
  })

  test('Member access', () => {
    expect(isAllowed(actionsMap.model.create, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.model.read, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.model.delete, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.model.update, 'Member')).toBe(false)
  })

  test('PM access', () => {
    expect(isAllowed(actionsMap.model.create, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.model.read, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.model.delete, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.model.update, 'PM')).toBe(true)
  })

  test('Developer access', () => {
    expect(isAllowed(actionsMap.model.create, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.model.read, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.model.delete, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.model.update, 'Developer')).toBe(true)
  })

  test('Collaborator access', () => {
    expect(isAllowed(actionsMap.model.create, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.model.read, 'Collaborator')).toBe(true)
    expect(isAllowed(actionsMap.model.delete, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.model.update, 'Collaborator')).toBe(false)
  })

  test('Editor access', () => {
    expect(isAllowed(actionsMap.model.create, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.model.read, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.model.delete, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.model.update, 'Editor')).toBe(true)
  })
})

describe.only('isAllowed: Content', () => {
  test('Owner access', () => {
    expect(isAllowed(actionsMap.content.create, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.content.read, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.content.delete, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.content.update, 'Owner')).toBe(true)
    expect(isAllowed(actionsMap.content.publish, 'Owner')).toBe(true)
  })

  test('Admin access', () => {
    expect(isAllowed(actionsMap.content.create, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.content.read, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.content.delete, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.content.update, 'Admin')).toBe(true)
    expect(isAllowed(actionsMap.content.publish, 'Admin')).toBe(true)
  })

  test('Member access', () => {
    expect(isAllowed(actionsMap.content.create, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.content.read, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.content.delete, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.content.update, 'Member')).toBe(false)
    expect(isAllowed(actionsMap.content.publish, 'Member')).toBe(false)
  })

  test('PM access', () => {
    expect(isAllowed(actionsMap.content.create, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.content.read, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.content.delete, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.content.update, 'PM')).toBe(true)
    expect(isAllowed(actionsMap.content.publish, 'PM')).toBe(true)
  })

  test('Developer access', () => {
    expect(isAllowed(actionsMap.content.create, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.content.read, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.content.delete, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.content.update, 'Developer')).toBe(true)
    expect(isAllowed(actionsMap.content.publish, 'Developer')).toBe(true)
  })

  test('Collaborator access', () => {
    expect(isAllowed(actionsMap.content.create, 'Collaborator')).toBe(true)
    expect(isAllowed(actionsMap.content.read, 'Collaborator')).toBe(true)
    expect(isAllowed(actionsMap.content.delete, 'Collaborator')).toBe(false)
    expect(isAllowed(actionsMap.content.update, 'Collaborator')).toBe(true)
    expect(isAllowed(actionsMap.content.publish, 'Collaborator')).toBe(false)
  })

  test('Editor access', () => {
    expect(isAllowed(actionsMap.content.create, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.content.read, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.content.delete, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.content.update, 'Editor')).toBe(true)
    expect(isAllowed(actionsMap.content.publish, 'Editor')).toBe(true)
  })
})