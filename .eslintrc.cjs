module.exports = {
    "root": true,
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    "settings": {
        "react": {
            "version": "detect",
        },
    },
    "ignorePatterns": ["node_modules/", "renderer/public/"],
}