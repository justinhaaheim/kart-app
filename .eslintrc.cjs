/**
 * Custom eslint config for CRA project
 */

/* eslint-disable no-unused-vars */
const OFF = 0;
const WARN = 1;
const ERROR = 2;
/* eslint-enable no-unused-vars */

const NO_UNUSED_VARS_CONFIG = [
  WARN,
  {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
];

module.exports = {
  env: {browser: true, es2020: true},

  extends: [
    'eslint:recommended',
    'react-app',
    // 'plugin:react-hooks/recommended',
    // prettier turns OFF rules that are unnecessary or might conflict with prettier
    'prettier',
  ],

  ignorePatterns: ['**/build/', '**/dist/', '**/node_modules/'],

  overrides: [
    /**
     * Typescript-only config
     */
    {
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        // prettier turns OFF rules that are unnecessary or might conflict with prettier
        'prettier',
      ],

      files: ['**/*.ts?(x)'],

      parser: '@typescript-eslint/parser',

      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
      },

      plugins: ['typescript-sort-keys'],

      rules: {
        '@typescript-eslint/consistent-type-imports': [
          WARN,
          {prefer: 'type-imports'},
        ],
        '@typescript-eslint/no-inferrable-types': WARN,
        '@typescript-eslint/no-unused-vars': NO_UNUSED_VARS_CONFIG,
        '@typescript-eslint/no-var-requires': WARN,
        '@typescript-eslint/sort-type-union-intersection-members': WARN,
        'typescript-sort-keys/interface': WARN,
        'typescript-sort-keys/string-enum': WARN,

        '@typescript-eslint/ban-ts-comment': [
          WARN,
          {
            'ts-ignore': 'allow-with-description',
          },
        ],

        // (This helps configure simple-import-sort) Make sure all imports are at the top of the file
        'import/first': ERROR,

        'simple-import-sort/imports': [
          ERROR,
          {
            // The default grouping, but with type imports first as a separate group.
            // See: https://github.com/lydell/eslint-plugin-simple-import-sort/blob/d9a116f71302c5dcfc1581fc7ded8d77392f1924/examples/.eslintrc.js#L122-L133
            groups: [
              ['^.*\\u0000$'],
              ['^\\u0000'],
              ['^@?\\w'],
              ['^'],
              ['^\\.'],
            ],
          },
        ],
      },
    },
  ],

  plugins: ['sort-keys-fix', 'simple-import-sort', 'react-refresh'],

  // Stop ESLint from looking for a configuration file in parent folders
  root: true,

  rules: {
    'react-hooks/exhaustive-deps': ERROR,

    'react-refresh/only-export-components': [WARN, {allowConstantExport: true}],

    'react/jsx-sort-props': WARN,

    // (This helps configure simple-import-sort) Make sure all imports are at the top of the file
    'import/first': ERROR,

    // (This helps configure simple-import-sort) Make sure there's a newline after the imports
    'import/newline-after-import': ERROR,

    // (This helps configure simple-import-sort) Merge imports of the same file
    'import/no-duplicates': ERROR,

    'no-console': OFF,

    'no-debugger': ERROR,

    'no-unused-expressions': ERROR,

    'no-unused-vars': NO_UNUSED_VARS_CONFIG,

    quotes: [ERROR, 'single', {allowTemplateLiterals: true, avoidEscape: true}],

    // This sorts re-exports (`export * from 'foo';`), but not other types of exports.
    'simple-import-sort/exports': ERROR,

    'simple-import-sort/imports': [
      ERROR,
      {
        // The default grouping, but with type imports first as a separate group.
        // See: https://github.com/lydell/eslint-plugin-simple-import-sort/blob/d9a116f71302c5dcfc1581fc7ded8d77392f1924/examples/.eslintrc.js#L122-L133
        groups: [['^.*\\u0000$'], ['^\\u0000'], ['^@?\\w'], ['^'], ['^\\.']],
      },
    ],

    'sort-keys-fix/sort-keys-fix': WARN,
  },
};
