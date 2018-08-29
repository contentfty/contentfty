/* eslint-disable */
import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'

const inBrowser = typeof window !== 'undefined'

const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const extractInfoFromHash = () => {
  if (process.SERVER_BUILD) {
    return
  }
  const {id_token, state} = getQueryParams()
  return {
    token: id_token,
    secret: state
  }
}
export const clientToken = () => {
  if (!inBrowser || !window.localStorage.token) {
    return null
  }
  const token = JSON.parse(window.localStorage.token)
  if (token) {
    if (new Date().getTime() >= token.expires) {
      return unsetToken()
    }
    return token
  }
}
export const getTokenFromCookie = (req) => {
  if (!req.headers.cookie) {
    return
  }
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) {
    return
  }
  const jwt = jwtCookie.split('=')[1]
  return jwt
  // } else {
  //   return window.localStorage.getItem('token')
  // }
  // return window.localStorage.getItem('token')
}
export const getToken = () => {
  return window.localStorage.getItem('token')
}
export const setToken = (token) => {
  if (process.SERVER_BUILD) {
    return
  }
  window.localStorage.setItem('token', JSON.stringify(token.value))
  window.localStorage.setItem('user', JSON.stringify(jwtDecode(token.value)))
  Cookie.set('jwt', token.value, { expires: token.expires })
}

export const unsetToken = () => {
  if (process.SERVER_BUILD) {
    return
  }
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('secret')
  Cookie.remove('jwt')
  window.localStorage.setItem('logout', Date.now())
}

export const getUserFromCookie = (req) => {
  if (!req.headers.cookie) {
    return
  }
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) {
    return
  }
  const jwt = jwtCookie.split('=')[1]
  return jwtDecode(jwt)
}

export const getUserFromLocalStorage = () => {
  const json = window.localStorage.user
  return json ? JSON.parse(json) : undefined
}

export const setSecret = (secret) => window.localStorage.setItem('secret', secret)

export const checkSecret = (secret) => window.localStorage.secret === secret
