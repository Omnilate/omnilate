// @ts-check
import defineConfig from '@akisaira/eslint-config'

export default [
  ...defineConfig({
    tsconfigPath: './tsconfig.json',
    tsconfigRootDir: '.'
  }),
  {
    ignores: ['dist/**']
  }
]
