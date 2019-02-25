module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [ "html" ],
    "settings": {
        "html/indent": "0",   // code should start at the beginning of the line (no initial indentation).
        "html/indent": "+2",  // indentation is the <script> indentation plus two spaces.
        "html/indent": "tab", // indentation is one tab at the beginning of the line.
    },
    "rules": {
        "quotes": ["error", "single"],
        "no-var": "error",
        "no-duplicate-imports": "error",
        "arrow-parens": ["error", "always"],
        "arrow-spacing": "error",
        "semi": ["error", "always"],
        "indent": ["error", "tab"],
        "array-bracket-spacing": ["error", "never"]
    }
};