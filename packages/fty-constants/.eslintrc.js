module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'promise/catch-or-return': 'error',
    'max-lines': [
      'error',
      { max: 250, skipBlankLines: true, skipComments: true }
    ],
    semi: [2, 'never']
  },
  globals: {
    ENV: true
  }
}
