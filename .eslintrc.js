module.exports = {
    ignorePatterns: ['.eslintrc.js'],
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        "plugin:react/jsx-runtime",
        "prettier"
    ],
    globals: { describe: true, it: true, expect: true, NodeJS: true },
    settings: {
        react: {
            version: 'detect',
        },
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [ "prettier", 'react', 'react-hooks', '@typescript-eslint'],
    rules: {
        'no-unused-vars': 'off',
        // 'react/prop-types': 'off',
        'react/display-name': 'off',
        // 'react-hooks/rules-of-hooks': 'error',
        // 'react-hooks/exhaustive-deps': 'off',
        'prettier/prettier': 'warn',
    },
};
