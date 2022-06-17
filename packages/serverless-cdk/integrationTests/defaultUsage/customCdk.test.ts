import runServerless from '@serverless/test/run-serverless';
import { Template } from 'aws-cdk-lib/assertions';
import path from 'path';

describe('customCdK', () => {
  it('should create all required resources', async () => {
    const { cfTemplate } = await runServerless(
      '../../node_modules/serverless',
      {
        command: 'package',
        cwd: path.join(__dirname, 'serverless-configurations', 'correct-cdk'),
      },
    );

    const template = Template.fromJSON(cfTemplate);

    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });
  it('should throw when serverlessCdkBridge is not a construct', async () => {
    await expect(
      runServerless('../../node_modules/serverless', {
        command: 'package',
        cwd: path.join(
          __dirname,
          'serverless-configurations',
          'wrong-serverless-cdk-bridge-class',
        ),
      }),
    ).rejects.toThrow('serverlessCdkBridge is not a construct');
  });
  it('should throw when serverlessCdkBridge property is missing', async () => {
    await expect(
      runServerless('../../node_modules/serverless', {
        command: 'package',
        cwd: path.join(
          __dirname,
          'serverless-configurations',
          'missing-serverless-cdk-bridge-key',
        ),
      }),
    ).rejects.toThrow('Missing serverlessCdkBridge property');
  });
});
