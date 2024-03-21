module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
    jest: true,
    'vitest-globals/env': true,
  },
  globals: {
    pendo: 'readonly',
    NodeJS: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:vitest-globals/recommended',
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier', 'testing-library'],
  overrides: [
    {
      files: ['**/*.test.[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
      rules: {
        'no-restricted-imports': [
          2,
          {
            name: '@testing-library/react',
            message: "Please use 'test-utils' instead.",
          },
        ],
        'testing-library/prefer-user-event': 2,
        'testing-library/prefer-explicit-assert': 2,
        'testing-library/prefer-wait-for': 2,
      },
    },
    {
      files: ['*.[jt]s?(x)'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'simple-import-sort/imports': 'off',
    'simple-import-sort/exports': 'off',
    'click-events-have-key-events': 'off',
    'no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'no-unused-vars': 'off',
    eqeqeq: 2,
    '@typescript-eslint/no-unused-vars': 1, // warning
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
  },
};
