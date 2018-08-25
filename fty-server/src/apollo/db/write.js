/* eslint-disable no-fallthrough,no-undef */
const _ = require('lodash')
const {readEntry} = require('./read')

const emptyField = function (field) {
  const role = field._role_
  return _.isEmpty(field) || _.isUndefined(role) !== _.isEmpty(field[role])
}
const writeEntry = async function (type, data, user) {
  const userModel = think.model('users')
  // console.log(user)
  // console.log('user --d-d-d-d-')
  switch (type) {
    case 'User': {
      const fieldModel = think.model('users')
      // await fieldModel.save(data)
      // const userData = await fieldModel.getById(id)
      // return userData
    }
    case 'Entry': {
      // const fieldModel = think.model('entries', {spaceId: spaceId});
      // 返回条目类型mwwp
    }
    case 'Org': {
      const orgModel = think.model('orgs');
      const fty = think.service('fty')
      // const org = args.org
      // const user = context.user
      const orgId = await fty.regElement(ElementType.org)
      // 新增类型注册成功后添加内容
      if (orgId !== false) {
        await orgModel.add({
          id: orgId,
          name: data.name,
          createdBy: user.id,
          updatedBy: user.id,
          createdAt: dateNow(),
          updatedAt: dateNow()
        })
        // 4 关联组织用户
        const role = 'owner'
        const usermeta = think.model('usermeta')
        await usermeta.add({
          userId: user.id,
          metaKey: `org_${orgId}_capabilities`,
          metaValue: JSON.stringify({'role': role, 'type': 'org'})
        })
        return {id: orgId}
      }
      // return null
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
  emptyField,
  writeEntry
}
