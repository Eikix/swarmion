import { AWS } from '@serverless/typescript';

import { requestSyncDeployment } from '@swarmion/orchestrator-contracts';
import {
  frameworkVersion,
  projectName,
  sharedEsbuildConfig,
  sharedParams,
  sharedProviderConfig,
} from '@swarmion/serverless-configuration';
import { ServerlessContracts } from '@swarmion/serverless-plugin';

import { functions } from 'functions';
import { cdkResources } from 'resources';

import { MyClass } from './myClass';

const serverlessConfiguration: AWS & ServerlessContracts = {
  service: `${projectName}-orchestrator`, // Keep it short to have role name below 64
  frameworkVersion,
  configValidationMode: 'error',
  plugins: [
    'serverless-esbuild',
    '@swarmion/serverless-plugin',
    'serverless-iam-roles-per-function',
    'serverless-analyze-bundle-plugin',
    './serverlessCdk.ts',
  ],
  params: sharedParams,
  provider: {
    ...sharedProviderConfig,
  },
  functions,
  package: { individually: true },
  custom: {
    projectName,
    esbuild: sharedEsbuildConfig,
    myClass: MyClass,
    myString: 'hi guys',
  },
  contracts: {
    provides: {
      requestSyncDeployment,
    },
    consumes: {},
  },
  resources: {
    Description: 'Monorepo deployments orchestrator',
    ...cdkResources,
  },
};

module.exports = serverlessConfiguration;
