/* eslint-disable no-undef,no-undef */
const typeDef = `
  type Org {
    id: String
    name: String
    created_by: String
    updated_by: String
    created_at: Date
    updated_at: Date
  }
  extend type Query {
    orgList: [Org]
  }
  input OrgInput {
    name: String!
  }
  extend type Mutation {
    createOrg(org: OrgInput):Org
  }
`
const orgModel = think.model('orgs');
const fty = think.service('fty')

const resolvers = {
  Query: {
    orgList: async (prev, args, context) => {
      const orgs = await orgModel.list();
      return orgs;
    }
    // memberships: async (prev, args, context) => {
    // const users = await orgModel
    // }
  },
  Mutation: {
    createOrg: async (prev, args, context) => {
      const org = args.org
      const user = context.user
      const orgId = await fty.regElement(ElementType.org)
      // 新增类型注册成功后添加内容
      if (orgId !== false) {
        await orgModel.add({
          id: orgId,
          name: org.name,
          created_by: user.id,
          updated_by: user.id,
          created_at: dateNow(),
          updated_at: dateNow()
        })
        // 4 关联组织用户
        const role = 'owner'
        const usermeta = think.model('usermeta')
        await usermeta.add({
          user_id: user.id,
          meta_key: `org_${orgId}_capabilities`,
          meta_value: JSON.stringify({'role': role, 'type': 'org'})
        })
        return {id: orgId}
      }
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
