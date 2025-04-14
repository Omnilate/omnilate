// @ts-check
import defineConfig from '@akisaira/eslint-config'

export default [
  ...defineConfig({
    tsconfigPath: './tsconfig.eslint.json',
    tsconfigRootDir: '.',
    extensionsEnabled: {
      solid: true
    }
  }), {
    ignores: ['src-tauri']
  }
]
