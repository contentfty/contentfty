/* eslint-disable no-undef,new-cap */
const typeDef = `
  type User {
    id: ID!
    login: String
    email: String!
    password: String!
    displayName: String
    activated: Boolean
    confirmed: Boolean
    activationKey: String
    deleted: Boolean
    phone: String
    createdAt: String
    updatedAt: String
  }
  extend type Query {
    all(take: Int, skip: Int, userId: Int): [User]
  }
  input UserInput {
    displayName: String!
    org: String!
    email: String!
    phone: String!
    password: String! 
  }
  extend type Mutation {
    createUser(user: UserInput):Auth
  }
`;

const resolvers = {
  Query: {
    all: async (prev, args, context) => {
      const fieldModel = think.model('users');
      const fields = await fieldModel.findByGroupId(args.groupId);
      return fields;
    }
  },
  Mutation: {
    createUser: async (prev, args, context) => {
      // 1 查询组织
      const user = args.user
      // 注册进 elements
      // 1 添加 user 类型
      // 2 添加 space 类型
      // 3 添加组织类型
      const userId = Generate.id()
      const spaceId = Generate.spaceId()
      const orgId = Generate.id()

      const elementsModel = think.model('elements')
      const userModel = think.model('users')
      const spaceModel = think.model('spaces')
      const orgModel = think.model('orgs')

      const insertIds = await elementsModel.addMany([
        {id: userId, type: think.elementType.user, createdAt: dateNow(), updatedAt: dateNow()},
        {id: orgId, type: think.elementType.org, createdAt: dateNow(), updatedAt: dateNow()},
        {id: spaceId, type: think.elementType.space, createdAt: dateNow(), updatedAt: dateNow()},
      ])

      if (insertIds.length === 3) {
        await userModel.add({
          id: userId,
          login: user.email,
          email: user.email,
          password: user.password,
          display_name: user.displayName,
          phone: user.phone
        })

        await orgModel.add({
          id: orgId,
          name: slugName(user.org),
          createdBy: userId,
          updatedBy: userId,
          createdAt: dateNow(),
          updatedAt: dateNow()
        })

        await spaceModel.add({
          id: spaceId,
          orgId: orgId,
          createdBy: userId,
          updatedBy: userId,
          createdAt: dateNow(),
          updatedAt: dateNow()
        })
      }

      const db = think.service('fty', {spaceId: spaceId})
      const res = await db.create()
      // 如果空间应用的相关表创建成功，就开始初始化数据
      if (think.isEmpty(res)) {
        // 记录用户 owner
        const spaceElementsModel = think.model('elements', {spaceId: spaceId})
        await spaceElementsModel.addMany([{
          id: userId,
          type: ElementType.user,
          createdAt: dateNow(),
          updatedAt: dateNow()
        }, {
          id: 'master',
          type: ElementType.env,
          createdAt: dateNow(),
          updatedAt: dateNow()
        }])
        // 创建环境
        const envModel = think.model('envs', {spaceId: spaceId})
        await envModel.add({
          id: 'master',
          spaceId: spaceId,
          // FAILURE
          // PENDING
          // READY
          status: 'ready',
          description: 'Master environment.'
        })
      } else {
        return this.fail(res)
      }
      // const result = await this.transaction(async () => {
      //   const insertId = await this.add(data);
      //   return insertId;
      // })
      // return {token: think.generate.spaceId + '---' + think.generate.id}
      return {token: userId + '-' + spaceId + '-' + orgId}
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
