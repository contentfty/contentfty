import Vue from 'vue'

export const getEnvVar = ({production, staging, local}) => {
  return process.env.ENV === 'production'
    ? production
    : process.env.ENV === 'staging'
      ? staging
      : local
}

const cookieName = getEnvVar({
  local: 'local-fty-accessToken',
  staging: 'staging-fty-accessToken',
  production: 'fty-accessToken'
})

const cookies = require('js-cookie')
const cookieConfig = {
  secure: !process.env.local,
  domain: 'fty.caixie.top'
}

export class Auth {
  getAuthCookie () {
    return cookies.get(cookieName, cookieConfig)
  }

  isAuth () {
    const accessToken = this.getAuthCookie()
    return !(accessToken === null || accessToken === undefined)
  }

  logout () {
    // Clear assess token and ID token from local storage
    this.clearSession()
    Vue.$ftyAnalytics.track('Logout')
    // navigate to the home route
    setTimeout(() => {
      this.login()
    })
  }

  login (query = {}) {
    let url = getEnvVar({
      production: 'https://contentfty.com/signin',
      staging: 'https://staging.contentfty.com/signin',
      local: 'http://dev.app.contentfty.com:3333/signin'
    })

    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    url = queryString
      ? url + '?' + queryString
      : url

    window.location = url
  }

  clearSession () {
    cookies.remove(cookieName)
    localStorage.removeItem('FTY-LAST-ORG-ID')
    sessionStorage.removeItem('FTY-LAST-USER-ID')
    sessionStorage.removeItem('FTY-IDENTIFY')
  }
}

export default new Auth()