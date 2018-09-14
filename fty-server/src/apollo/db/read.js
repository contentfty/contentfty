/* eslint-disable no-fallthrough */

/**
 * 按类型查询出内容列表
 * @returns {Promise<Array>}
 */
const readType = async function ({ type, spaceId, skip, limit, where }) {
  switch (type) {
    case 'User': {
      console.log(where)
      const fieldModel = think.model('users');
      const userData = await fieldModel.page(1, limit).countSelect()

      console.log(userData)
      return userData
      // return {
      //   total: userData.count,
      //   skip: userData.currentPage,
      //   limit: userData.pageSize,
      //   data: userData.data
      // }
    }
    case 'UserCollection': {
      const fieldModel = think.model('users');
      const userData = await fieldModel.page(1, limit).countSelect()
      return {
        total: userData.count,
        skip: userData.currentPage,
        limit: userData.pageSize,
        data: userData.data
      }
    }
    case 'Entry': {
      return await think.model('entries', { spaceId: spaceId }).select()
    }
    case 'EntryType': {
      const entrytypesModel = await think.model('entrytypes', { spaceId: spaceId })
      // let data = await entrytypesModel.page(page, limit).countSelect();
      return await entrytypesModel.select();
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
      // console.log(entryList)
      const fields = think._.map(entryList, 'fields')
      // console.log(fields)
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
  if (think.isEmpty(id)) {
    return null
  }
  switch (type) {
    case 'User': {
      const userModel = think.model('users');
      const userData = await userModel.getById(id)
      return userData
    }
    case 'EntryType': {
      const entrytypesModel = await think.model('entrytypes', { spaceId: spaceId })
      return await entrytypesModel.where({id:id}).find();
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

////////////////////接口/////////////////////
const entryTypes = async function (id, spaceId) {
  if (think.isEmpty(id)) {
    let limit = 1000;
    let page = 1;

    const entrytypesModel = await think.model('entrytypes', { spaceId: spaceId })
    //获取内容类型json列表结构
    let data = await entrytypesModel.page(page, limit).countSelect();

    console.log(data)
    return [data];
  }

  return []
}


module.exports = {
  readType,
  readEntry,
  entryTypes
}
