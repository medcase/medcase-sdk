module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    plugins: [
        "prettier",
        "@typescript-eslint"
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
};
