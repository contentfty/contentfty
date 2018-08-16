/* eslint-disable no-undef,no-undef */
const typeDef = `
  type Space {
    id: String
    org_id: String
    name: String
    created_by: String
    updated_by: String
    created_at: Date
    updated_at: Date
  }
  extend type Query {
    spaceList: [Space]
  }
  extend type Mutation {
    createSpace(orgId: String!, name: String!):Space
  }
`
const spaceModel = think.model('spaces');
const fty = think.service('fty')

const resolvers = {
  Query: {
    spaceList: async (prev, args, context) => {
      const spaces = await spaceModel.list();
      return spaces;
    }
    // memberships: async (prev, args, context) => {
    // const users = await orgModel
    // }
  },
  Mutation: {
    createSpace: async (prev, args, context) => {
      const userId = context.user.id
      console.log(userId)
      // 验证组织 ID
      const orgModel = think.model('orgs')
      const originOrg = await orgModel.where({id: args.orgId}).field(['id']).find()
      // if (think.isEmpty)
      if (think.isEmpty(originOrg) || args.orgId !== originOrg.id) {
        throw new Error('OrgId is not exists!')
      }
      const spaceId = await fty.regElement(ElementType.space)
      await spaceModel.add({
        id: spaceId,
        name: args.name,
        org_id: args.orgId,
        status: 'pending',
        created_by: context.user.id,
        updated_by: context.user.id,
        created_at: dateNow(),
        updated_at: dateNow()
      })
      const db = think.service('fty', {spaceId: spaceId})
      const res = await db.create()
      if (think.isEmpty(res)) {
        // 记录用户 owner
        const spaceElementsModel = think.model('elements', {spaceId: spaceId})
        await spaceElementsModel.addMany([{
          id: userId,
          type: ElementType.user,
          created_at: dateNow(),
          updated_at: dateNow()
        }, {
          id: 'master',
          type: ElementType.env,
          created_at: dateNow(),
          updated_at: dateNow()
        }])
        // 创建环境
        const envModel = think.model('envs', {spaceId: spaceId})
        await envModel.add({
          id: 'master',
          space_id: spaceId,
          // FAILURE
          // PENDING
          // READY
          status: 'ready',
          description: 'Master environment.'
        })

        // 更新空间状态
        await spaceModel.where({
          id: spaceId
        }).update({
          status: 'ready',
          update_at: dateNow()
        })
      } else {
        return this.fail(res)
      }

      // 关联 space 用户
      const role = 'manager'
      const usermeta = think.model('usermeta')
      await usermeta.add({
        user_id: userId,
        meta_key: `space_${spaceId}_capabilities`,
        meta_value: JSON.stringify({'role': role, 'type': 'space'})
      })

      const persistSpace = await spaceModel.where({id: spaceId}).find()
      return persistSpace
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
