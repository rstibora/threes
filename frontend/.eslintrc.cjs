module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        "parser": "@typescript-eslint/parser",
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
    ],
    rules: {
        "vue/html-indent": "off",
        // "vue/html-self-closing": ["error", {
            // "html": {
                // "component": "any",
            // }
        // } 
    },
};
