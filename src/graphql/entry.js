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
    data: Json
    typeId: String!
    name: String!
    instructions: String
    unique: Boolean
    required: Boolean
    disabled: Boolean
    validations: Json
    settings: Json
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
      const typeId = args.typeId
      const data = {
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
      // console.log(contentType)
      // 2 验证内容是否符合规则
      // 3 符合规则后存储内容
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
