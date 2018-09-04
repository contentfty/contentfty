/* eslint-disable no-fallthrough */

/**
 * 按类型查询出内容列表
 * @returns {Promise<Array>}
 */
const readType = async function ({ type, spaceId }) {
  switch (type) {
    case 'User': {
      const fieldModel = think.model('users');
      const userData = await fieldModel.select()
      return userData
    }
    case 'Entry': {
      return await think.model('entries', { spaceId: spaceId }).select()
    }
    case 'EntryType': {
      return await think.model('entrytypes', { spaceId: spaceId }).select()
    }
    case 'Org': {
      return await think.model('orgs').select()
    }
    case 'Space': {
      return await think.model('spaces').select()
    }
    case 'Field': {
      return await think.model('fields', { spaceId: spaceId }).select()
    }
    default: {
      const et = await think.model('entrytypes', { spaceId: spaceId }).where({
        name: type
      }).find()
      
      if (think.isEmpty(et)) {
        return []
      }

      const entries = await think.model('entries', { spaceId: spaceId }).where({ typeId: et.id }).select()
      const ids = think._.map(entries, 'id')
      // 临时测试处理
      const entryList = await think.model('entryversions', { spaceId: spaceId }).where(
        {
          entryId: ['IN', ids]
        }
      ).select()
      for (let obj of entryList) {
        obj.fields = JSON.parse(obj.fields)
      }
      console.log(entryList)
      const fields = think._.map(entryList, 'fields')
      console.log(fields)
      return fields
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
const readEntry = async function ({ type, id, spaceId }) {
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
      const fieldModel = think.model('entries', { spaceId: spaceId });
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
}

module.exports = {
  readType,
  readEntry
}
