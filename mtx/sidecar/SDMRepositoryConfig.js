module.exports = {
  sdm: {
    repositoryConfig: {
      displayName: 'PRA SDM Repository',
      description: 'Onboarded on tenant subscription',
      repositoryType: 'internal',
      isVersionEnabled: 'false',
      isVirusScanEnabled: 'true',
      skipVirusScanForLargeFile: 'false',
      hashAlgorithms: 'SHA-256',
      repositoryParams: {
        paramName: 'fileExtensions',
        paramValue: '{type:allow, list:[pdf, jpeg, png]}'
      }
    }
  }
};
