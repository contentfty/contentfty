/* eslint-disable no-undef */
const typeDef = `
  enum FieldType {
    Symbol
    Text
    Integer
    Number
    Date
    Location
    Boolean
    Link
    Array
    Object
  }
  type Field {
    id: String!
    typeId: String!
    name: String!
    instructions: String
    type: String!
    unique: Boolean
    required: Boolean
    disabled: Boolean
    validations: Json
    settings: Json
    createdAt: String
    updatedAt: String
  }
  input FieldInput {
    typeId: String!
    id: String!
    name: String!
    type: FieldType!
    instructions: String
    unique: Boolean
    required: Boolean
    disabled: Boolean
    validations: Json
    settings: Json
  }
  extend type Query {
    fieldList(groupId: Int!): [Field]
  }
  extend type Mutation {
    createField(field: FieldInput):Field
  }
`;

const resolvers = {
  Query: {
    fieldList: async (prev, args, context) => {
      const fieldModel = think.model('fields', {sapceId: context.spaceId});
      const fields = await fieldModel.findByGroupId(args.groupId);
      return fields;
    }
  },
  Mutation: {
    createField: async (prev, args, context) => {
      const entrytypeModel = think.model('entrytypes', {spaceId: context.sapceId})
      const field = args.field
      const typeId = field.typeId
      const exists = await entrytypeModel.where({id: typeId}).find()
      if (!exists) {
        throw new Error('Content Type is not exists!')
      }
      // 1 检查 content Type
      // 从缓存中取到所有内容类型验证
      const fieldModel = think.model('fields', {spaceId: context.spaceId})
      await fieldModel.add({
        id: field.id,
        typeId: field.typeId,
        name: field.name,
        type: field.type,
        instructions: field.instructions,
        unique: field.unique,
        required: field.required,
        disabled: field.disabled,
        validations: field.validations,
        settings: field.settings,
        createdAt: dateNow(),
        updatedAt: dateNow()
      })
      // 更新内容类型表
      await entrytypeModel.where({
        id: typeId
      }).update({
        'fields': ['exp', `JSON_ARRAY_APPEND(fields, '$', '${field.id}')`]
      })
      return await fieldModel.where({id: field.id, typeId: field.typeId}).find()
    }
  }
};

module.exports = {
  typeDef,
  resolvers
};
