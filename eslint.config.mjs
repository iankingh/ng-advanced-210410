import tseslint from 'typescript-eslint';

export default [{ ignores: ['src/assets/**', 'dist/**', '.angular/**'] }, {
  files: ['src/**/*.ts'],
  languageOptions: { parser: tseslint.parser },
  rules: {
    eqeqeq: 'error',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-unreachable': 'error',
    'no-constant-condition': 'error',
  },
}];
