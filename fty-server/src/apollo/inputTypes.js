const {
  GraphQLInputObjectType,
  GraphQLList,
} = require('graphql')
const {InputTypeComposer, EnumTypeComposer} = require('graphql-compose')

/**
 * 链接类型枚举
 */
const LinkETC = EnumTypeComposer.create({
  name: 'SysTypeEnum',
  values: {
    ASSET: {value: 'Asset'},
    ENTRY: {value: 'Entry'},
    SPACE: {value: 'Space'},
    ENVIRONMENT: {value: 'Environment'}
  }
})
/**
 * 字段类型枚举
 */
const FieldETC = EnumTypeComposer.create({
  name: 'FieldTypeEnum',
  values: {
    SHORT_TEXT: {value: 'symbol', description: '短文本, 一般用于标题、名称等; 最大长度 256字符'},
    LONG_TEXT: {value: 'text', description: '长文本，文章段落、大量文本, 最大长度  50,000字符'},
    INTEGER: {value: 'integer', description: '整型数字, -253 253'},
    DECIMAL: {value: 'number', description: '浮点数字'},
    DATE: {value: 'date', description: '日期, | "2018-11-06T09:45:27"'},
    LOCATION: {value: 'location', description: '地理位置座标, | {"lat": 52.5208, "lon": 13.4049}'},
    BOOLEAN: {value: 'boolean', description: '状态值，如：真或假，是或否 | true'},
    MEDIA: {value: 'link', description: '链接一个媒体资源，如：图片、文件等'},
    REFERENCE: {value: 'link', description: '链接一个条目，如：文章的作者'},
    ARRAY: {value: 'array', description: '列表，如课程的多个章节关联  | ["name1", "name2", ...]'},
    JSON_OBJECT: {value: 'object', description: '一些自定义的数据以 JSON 格式存储 | {"foo": "bar"}'}
  }
})

// const LinkDataInputType = new GraphQLInputObjectType({
//   name: 'LinkDataInput',
//   fields: () => ({
//     type: {
//       type: GraphQLString
//     },
//     id: {
//       type: GraphQLID
//     }
//   })
// })
//
// const LinkInputType = new GraphQLInputObjectType({
//   name: 'LinkInput',
//   fields: () => ({
//     link: {
//       type: LinkDataInputType
//     }
//   })
// })

/**
 * 验证输入中的正则输入类型
 */
const _RegexpITC = InputTypeComposer.create({
  name: 'RegexpInput',
  description: '正则表达式验证规则',
  fields: {
    pattern: {
      type: 'String!',
      description: '正则字符'
    }
  }
})

/**
 * 验证输入中的尺寸输入类型
 */
const _SizeITC = InputTypeComposer.create({
  name: 'Size',
  description: '字段大小限制',
  fields: {
    min: {
      type: 'Int',
      description: '最小值'
    },
    max: {
      type: 'Int',
      description: '最大值'
    }
  }
})

/**
 * 验证输入类型
 */
const ValidationITC = InputTypeComposer.create({
  name: 'ValidationInput',
  description: '验证信息输入',
  fields: {
    size: _SizeITC,
    regexp: _RegexpITC,
    in: {
      type: '[String]',
      description: '选项规则,例如多个 Tag'
    },
    linkContentType: {
      type: '[String]',
      description: '引用关系的内容类型'
    },
    message: {
      type: 'String',
      description: '字段信息'
    }
  }
  // types: [RegexpITC.getType(), SizeITC.getType()]
})

/**
 * 组的元素输入类型
 */
const ArrayItemITC = InputTypeComposer.create({
  name: "ArrayItemInput",
  fields: {
    type: FieldETC,
    validations: [ValidationITC],
    linkType: {
      type: LinkETC,
      description: 'Link 字段的类型'
    }
  }
})

/**
 * 字段输入类型
 */
const FieldITC = InputTypeComposer.create({
  name: 'EntryTypeFieldInput',
  description: '内容字段',
  fields: {
    type: {
      type: FieldETC.getTypeNonNull(),
      description: '字段类型'
    },
    linkType: {
      type: LinkETC,
      description: 'Link 字段的类型'
    },
    name: {
      type: 'String!',
      description: '不允许汉字与特殊字符, 字段唯一标识'
    },
    title: {
      type: 'String',
      description: '字段标题, 可用于生成 name'
    },
    instructions: {
      type: 'String',
      description: '字段简介'
    },
    unique: {
      type: 'Boolean',
      description: '字段是否唯一'
    },
    required: {
      type: 'Boolean',
      description: '字段是否必填'
    },
    validations: {
      type: [ValidationITC.getType()],
      description: '字段的验证规则'
    },
    items: {
      type: ArrayItemITC,
      description: '数组元素规则'
    },
    settings: {
      type: 'JSON',
      description: '字段的样式配置'
    }
  }
})

// 系统信息输入
// const SysITC = InputTypeComposer.create({
//   name: 'SysInfoInput',
//   description: '系统内置格式内容',
//   fields: {
//     type: {
//       type: LinkETC,
//       description: '系统内置类型'
//     },
//     id: {
//       type: 'String',
//       description: '唯一标识'
//     }
//   }
// })
const ArrayInputType = new GraphQLInputObjectType({
  name: 'ArrayInput',
  fields: () => ({
    array: {
      type: new GraphQLList(LinkDataInputType)
    }
  })
})

// const FieldType = new GraphQLInputObjectType({
//   name: 'FieldType',
//   fields: () => ({
//     name: {
//       type: GraphQLString
//     },
//     type: {
//       type: new GraphQLList(GraphQLString)
//     }
//   })
// })

// const SchemaType = new GraphQLInputObjectType({
//   name: 'SchemaType',
//   fields: () => ({
//     name: {
//       type: GraphQLString
//     },
//     fields: {
//       type: new GraphQLList(FieldType)
//     }
//   })
// })

module.exports = {
  LinkETC,
  FieldETC,
  FieldITC,
  ValidationITC,
  ArrayItemITC
}