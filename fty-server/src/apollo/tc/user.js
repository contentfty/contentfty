const {TypeComposer} = require('graphql-compose')

const {PaginationInfoTC} = require('./pagination')
// const PageInfoTC = TypeComposer.create()
// total: userData.count,
//   skip: userData.currentPage,
//   limit: userData.pageSize,
//   data: userData.data


const UserTC = TypeComposer.create({
  name: 'User',
  fields: {
    id: 'String!',
    login: 'String',
    email: 'String',
    password: 'String',
    displayName: 'String',
    activated: 'Boolean',
    confirmed: 'Boolean',
    activationKey: 'String',
    deleted: 'Boolean',
    phone: 'String',
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  description: 'User data model'
})
const UserPaginationTC = TypeComposer.create({
  name: 'UserPagination',
  fields: {
    count: 'Int',
    items: [UserTC],
    pageInfo: PaginationInfoTC
  }
})

UserTC.addResolver({
  kind: 'query',
  name: 'findMany',
  description: 'List of my favourite food around the world',
  args: {
    limit: {
      type: 'Int',
      defaultValue: 20
    },
    skip: 'Int'
  },
  // result type of this reslover
  // an array of UserTC
  type: UserTC,
  // type: UserPaginationTC,
  resolve: async ({args, context}) => {
    const fieldModel = think.model('users')
    const userData = await fieldModel.page(args.skip, args.limit).countSelect()
    return userData.data
    // return {
    //   count: userData.count,
    // pageInfo: {
    //   currentPage: userData.currentPage,
    //   count: userData.count,
    //   pageSize: userData.pageSize
    // },
    // items: userData.data
    // total: userData.count,
    // skip: userData.currentPage,
    // limit: userData.pageSize,
    // data: userData.data
    // }
  }
})

UserTC.addResolver({
  kind: 'query',
  name: 'byId',
  args: {
    id: {type: 'String'}
  },
  type: UserTC,
  resolve: async({args, context}) => {
    const fieldModel = think.model('users')
    const userData = await fieldModel.where({id: args.id}).find()
    return userData
  }
})

UserTC.addResolver({
  kind: 'query',
  name: 'one',
  args: {
    filter: `input UserFilterInput {
      email: String
      login: String
      phone: String
    }`
  },
  type: UserTC,
  resolve: async({args, context}) => {
    const fieldModel = think.model('users')
    const userData = await fieldModel.where({...args.filter}).find()
    return userData
  }
})

UserTC.addResolver({
  kind: 'query',
  name: 'pagination',
  args: {
    limit: {
      type: 'Int',
      defaultValue: 20
    },
    skip: 'Int'
  },
  type: UserPaginationTC,
  resolve: async ({args, context}) => {
    const fieldModel = think.model('users')
    const userData = await fieldModel.page(args.skip, args.limit).countSelect()
    // return userData.data
    return {
      count: userData.count,
      items: userData.data,
      pageInfo: {
        currentPage: userData.currentPage,
        count: userData.count,
        pageSize: userData.pageSize
      }
    }
  }
})

module.exports = {
  UserTC
}
