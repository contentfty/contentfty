/* eslint-disable no-undef */
const typeDef = `
  type Entry {
    id: Int
    env: String
    typeId: String
    createdBy: User
    updatedBy: User
    publishedAt: String
    createdAt: String
    updatedAt: String
    displayField: String
    locale: String
    name: String
    data: [Field]
  }
  extend type Query {
    entryList(typeId: String!): [Entry]
  }
   
  input EntryInput {
    id: String
    typeId: String!
    data: Json
  }
  extend type Mutation {
    createEntry(typeId: String!, entry: EntryInput):Field
  }
`;

const resolvers = {
  Query: {
    fieldList: async (prev, args, context) => {
      const fieldModel = think.model('fields', {appId: context.appId});
      const fields = await fieldModel.findByGroupId(args.groupId);
      return fields;
    }
  },
  Mutation: {
    createEntry: async (prev, args, context) => {
      let entry = args.entry
      if (Object.is(entry.id, undefined)) {
        entry.id = await think.service('fty').regElement(ElementType.entry)
      }
      const userId = context.user.id
      const typeId = args.typeId
      // fakeDATA
      const fakeFieldsData = {
        "title": {
          "zh-CN": "这是一个标题"
        },
        "slug": {
          "zh-CN": "hello"
        },
        "shortDescription": {
          "zh-CN": "这是一些简短的介绍"
        },
        "description": {
          "zh-CN": "这是内容介绍"
        },
        "categories": {
          "zh-CN": [{
            "type": "Link",
            "linkType": "Entry",
            "id": ""
          }]
        }
      }
      // 1 查询出规则
      const contentType = await think.model('entrytypes', {spaceId: context.spaceId}).getById(typeId)
      // 2 验证内容是否符合规则
      // console.log(contentType)

      // 3 符合规则后存储内容
      const entryModel = think.model('entries', {spaceId: context.spaceId})
      // 4 根据状态保存内容，默认发布至 versions
      await entryModel.save({
        entryId: entry.id,
        createdBy: userId,
        typeId: typeId,
        data: fakeFieldsData
      })
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
