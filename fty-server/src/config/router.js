module.exports = [
  // [/\/v1\/org\/(\d+)\/(subdomain_validation|signin|signout)?/, '/api/v1/org/public?orgId=:1&action=:2', 'rest'],
  // [/\/api\/v1\/(subdomain_validation|signin|signup|signout|login)?/, '/account', 'get, post'],
  [/\/api\/(\w+)\/(\w+)?/, '/:1/:2', 'get, post'],
  // [/\/api\/auth\/login?/, 'auth/login', 'rest'],
];
