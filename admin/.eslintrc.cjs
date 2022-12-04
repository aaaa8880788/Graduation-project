module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        'vue/setup-compiler-macros': true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended",
        'plugin:prettier/recommended',
    ],
    "overrides": [
    ],
    // 解析器
    "parser":"vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "parser": "@typescript-eslint/parser",
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
