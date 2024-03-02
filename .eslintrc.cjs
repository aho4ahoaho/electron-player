module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            typescript: {},
        },
    },
    rules: {
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/display-name": "off",
    },
    ignorePatterns: ["node_modules/", "renderer/public/", "renderer/.next", "app/"],
};
