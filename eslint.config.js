import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'antfu/if-newline': 0,
    'node/prefer-global/process': 'off',
  },
})
