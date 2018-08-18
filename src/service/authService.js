const jwt = require('jsonwebtoken');
const secret = 'S1BNbRp2b';
const {createHash} = require('crypto')

module.exports = class extends think.Service {
  /**
   * 根据 header 中的 X-Picker-Token 值获取用户id
   */
  async getUserId () {
    const token = think.token;
    if (!token) {
      return 0;
    }

    const result = await this.parse();
    if (think.isEmpty(result) || result.user_id <= 0) {
      return 0;
    }

    return result.user_id;
  }

  /**
   * 根据值获取用户信息
   */
  async getUserInfo () {
    const userId = await this.getUserId();
    if (userId <= 0) {
      return null;
    }

    const userInfo = await this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({id: userId}).find();

    return think.isEmpty(userInfo) ? null : userInfo;
  }

  /**
   * 生成 token
   * @param username
   * @param password
   * @returns {Promise<{expires: number, token: *}>}
   */
  async generateToken (playload, secret, expiresIn) {
    const secretOrKey = secret ? secret : think.config('jwt').secret
    const token = jwt.sign(playload, secretOrKey, {expiresIn: expiresIn ? expiresIn : 60 * 60})

    return {expires: expiresIn, token}
  }

  async parse () {
    if (think.token) {
      try {
        return jwt.verify(think.token, secret);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  async verify () {
    const result = await this.parse();
    if (think.isEmpty(result)) {
      return false;
    }

    return true;
  }
}
