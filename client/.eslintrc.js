module.exports = {
  env: {
    browser: true
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  parserOptions: {
    ecmaVersion: 8
  },
  plugins: ['vue'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'windows'],
    semi: ['error', 'never'],
    'no-unused-vars': 'off'
  }
}
