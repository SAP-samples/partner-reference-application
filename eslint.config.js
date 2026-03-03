'strict';
const js = require('@eslint/js');
const cdsEslintPlugin = require('@sap/eslint-plugin-cds');

module.exports = [
  cdsEslintPlugin.configs.all,
  cdsEslintPlugin.configs.js.all,
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        // CAP/CDS
        SELECT: true,
        INSERT: true,
        UPSERT: true,
        UPDATE: true,
        DELETE: true,
        CREATE: true,
        DROP: true,
        CDL: true,
        CQL: true,
        CXL: true,
        cds: true,
        sap: true,
        jQuery: true,
        // General
        console: true,
        module: true,
        require: true,
        window: true,
        Buffer: true,
        process: true,
        // UI test suite
        QUnit: true,
        location: true,
        // mocha
        describe: true,
        it: true,
        before: true,
        after: true,
        beforeEach: true,
        afterEach: true,
        __dirname: true,
        global: true,
        URL: true,
        // SAPUI5
        $: true,
        atob: true
      }
    },
    rules: {
      'no-console': 'off',
      'require-atomic-updates': 'off',
      '@sap/cds/no-deep-sap-cds-import': 'warn',
      '@sap/cds/no-shared-handler-variable': 'error',
      '@sap/cds/cql-template-strings': 'warn',
      '@sap/cds/start-elements-lowercase': 'warn'
    }
  },
  {
    ignores: ['gen/', 'srv/external/']
  }
];
