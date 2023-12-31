module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest": true,
    "es2020": true
  },
  "ignorePatterns": [
    "src/serviceWorker.ts",
    "plop-templates/**/*.hbs",
    "dist",
    ".eslintrc.cjs",
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "import",
    "react-refresh"
  ],
  "settings": {
    "import/resolver": {
      "node": {
        "paths": [
          "src"
        ],
        "moduleDirectory": [
          "node_modules",
          "src/"
        ],
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".types",
          ".types.tsx",
          ".d.ts"
        ]
      }
    }
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      {
        "allowConstantExport": true
      }
    ],
    "quotes": [
      "error",
      "single",
      {
        "avoidEscape": true
      }
    ],
    "max-len": [
      "error",
      120
    ],
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "@typescript-eslint/ban-ts-comment": 2,
    "@typescript-eslint/no-explicit-any": 2,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "react/jsx-filename-extension": [
      "error",
      {
        "extensions": [
          ".tsx",
          ".types",
          ".styles"
        ]
      }
    ],
    "import/extensions": [
      "error",
      "never",
      {
        "svg": "always",
        "tsx": "never",
        "types": "never"
      }
    ],
    "import/order": [
      "error",
      {
        "groups": [
          [
            "external",
            "builtin"
          ],
          [
            "parent",
            "internal"
          ],
          [
            "index",
            "sibling"
          ]
        ],
        "newlines-between": "always"
      }
    ],
    "import/no-duplicates": 2,
    "import/no-useless-path-segments": 2,
    "import/prefer-default-export": 0,
    "import/named": 0,
    "import/namespace": 0,
    "import/default": 0,
    "import/no-named-as-default-member": 0,
    "import/no-named-as-default": 0,
    "import/no-cycle": 0,
    "import/no-unused-modules": 0,
    "import/no-deprecated": 0,
    "@typescript-eslint/indent": 0,
    "import/no-anonymous-default-export": 2,
    "react-hooks/rules-of-hooks": 2,
    "camelcase": 2,
    "prefer-destructuring": 2,
    "no-nested-ternary": 2
  }
}

