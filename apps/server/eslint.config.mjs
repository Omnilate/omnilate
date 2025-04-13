// @ts-check
import defineConfig from '@akisaira/eslint-config'
import { plugin as tsPlugin } from 'typescript-eslint'

export default [...defineConfig({
  tsconfigPath: './tsconfig.json',
  tsconfigRootDir: '.'
}),
{
  plugins: {
    '@typescript-eslint': tsPlugin
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
}]
