/* eslint-disable no-fallthrough */

/**
 * 按类型查询出内容列表
 * @returns {Promise<Array>}
 */
const readType = async function (type) {
  // return []
  switch (type) {
    case 'User': {
      const fieldModel = think.model('users');
      const userData = await fieldModel.getById(id)
      return userData
    }
    case 'Entry': {
      return await think.model('entries').select()
      // const fieldModel = think.model('entries', {spaceId: spaceId});
      // 返回条目类型mwwp
    }
    case 'EntryType': {
      return await think.model('entrytypes').select()
      // const fieldModel = think.model('entries', {spaceId: spaceId});
      // 返回条目类型mwwp
    }
    case 'Org': {
      // return null
      return await think.model('orgs').select()
    }
    case 'Space': {
      return await think.model('spaces').select()
    }
    case 'Field': {
      return null
    }
    default: {
      return null
    }
  }
}

/**
 * 条目内容读取
 * (此条目为整体性概念，所有内容均称为 Entry, 非数据表中的 Entry)
 * @param type 条目类型
 * @param id 内容 ID
 * @param spaceId 空间ID
 * @returns {Promise<*>}
 */
const readEntry = async function ({type, id, spaceId}) {
  if (id === 'undefined') {
    return null
  }
  switch (type.toString()) {
    case 'User': {
      const fieldModel = think.model('users');
      const userData = await fieldModel.getById(id)
      return userData
    }
    case 'Entry': {
      const fieldModel = think.model('entries', {spaceId: spaceId});
      // 返回条目类型mwwp
    }
    case 'Org': {
      return null
    }
    case 'Space': {
      return null
    }
    case 'Field': {
      return null
    }
    default: {
      return null
    }
  }

  // const fields = await fieldModel.findByGroupId(args.groupId);
  // return fields;
  //
  // return null
}

module.exports = {
  readType,
  readEntry
}
