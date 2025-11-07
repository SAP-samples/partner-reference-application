'strict';
const js = require('@eslint/js');
const cdsEslintPlugin = require('@sap/eslint-plugin-cds');

module.exports = [
  cdsEslintPlugin.configs.all,
  js.configs.recommended,
  {
    plugins: {
      cds: cdsEslintPlugin
    },
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
      'cds/no-deep-sap-cds-import': 'warn',
      'cds/no-shared-handler-variable': 'error',
      'cds/use-cql-select-template-strings': 'warn'
    }
  },
  {
    ignores: ['gen/', 'srv/external/']
  }
];
