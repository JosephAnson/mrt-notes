import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  markdown: true,
  stylistic: true,
  ignores: ['.nuxt'],
  rules: {
    'antfu/if-newline': 0,
    'node/prefer-global/process': 'off',
    'ts/strict-boolean-expressions': 'off',
  },
})
