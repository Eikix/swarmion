const serverlessConfiguration: any = {
  service: 'test-app',
  configValidationMode: 'error',
  plugins: ['../../../../src'],
  provider: {
    name: 'aws',
  },
  serverlessCdkBridge: Error,
};

module.exports = serverlessConfiguration;
