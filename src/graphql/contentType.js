/* eslint-disable no-undef */
const typeDef = `
  type EntryType {
    id: String!
    name: String!
    fields: [Field]
    createdBy: User
    updatedBy: User
    createdAt: String
    updatedAt: String
  }
  extend type Query {
    entryType(id: String): EntryType
    entryTypeList(groupId: Int!): [EntryType]
  }
  
  input EntryTypeInput {
    id: String!
    name: String!
    #fields: [FieldInput]
  }
  
  extend type Mutation {
    createContentType(entryType: EntryTypeInput):EntryType
  }
`;

const resolvers = {
  Query: {
    entryType: async (prev, args, context) => {
      const entryTypeModel = think.model('entrytypes', {spaceId: context.spaceId})
      const typeId = args.id
      const oneData = await entryTypeModel.where({id: typeId}).find()
      oneData.createdBy = await think.model('users').where({id: context.user.id}).find()
      oneData.updatedBy = await think.model('users').where({id: context.user.id}).find()

      const fieldModel = think.model('fields', {spaceId: context.spaceId})
      oneData.fields = JSON.parse(oneData.fields)
      if (oneData.fields.length > 0) {
        const fieldsList = await fieldModel.where({
          id: ['IN', oneData.fields],
          typeId: typeId
        }).select()
        oneData.fields = fieldsList
      }
      return oneData
    },
    entryTypeList: async (prev, args, context) => {
      const fieldModel = think.model('fields', {appId: context.appId});
      const fields = await fieldModel.findByGroupId(args.groupId);
      return fields;
    }
  },
  Mutation: {
    createContentType: async (prev, args, context) => {
      const entryTypeModel = think.model('entrytypes', {spaceId: context.spaceId})
      const entryType = args.entryType
      // try {
      await entryTypeModel.add({
        id: entryType.id,
        name: entryType.name,
        // 必需默认添加 JSON 空数组，否则影响 fileds 的添加
        fields: JSON.stringify([]),
        createdBy: context.user.id,
        updatedBy: context.user.id,
        createdAt: dateNow(),
        updatedAt: dateNow()
      })
      const newType = await entryTypeModel.where({id: entryType.id}).find()
      if (!think.isEmpty(newType)) {
        // 待整合进 service
        newType.createdBy = await think.model('users').where({id: newType.createdBy}).find()
        newType.updatedBy = await think.model('users').where({id: newType.updatedBy}).find()
      }
      return newType
      // } catch (err) {
      //   throw err
      // }
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
