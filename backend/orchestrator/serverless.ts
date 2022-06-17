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

import { MyConstruct } from './myConstruct';

const serverlessConfiguration: AWS & ServerlessContracts = {
  service: `${projectName}-orchestrator`, // Keep it short to have role name below 64
  frameworkVersion,
  configValidationMode: 'error',
  plugins: [
    'serverless-esbuild',
    '@swarmion/serverless-plugin',
    'serverless-iam-roles-per-function',
    'serverless-analyze-bundle-plugin',
    '@swarmion/serverless-cdk',
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
    myConstruct: MyConstruct,
  },
  contracts: {
    provides: {
      requestSyncDeployment,
    },
    consumes: {},
  },
  resources: {
    Description: 'Monorepo deployments orchestrator',
  },
};

module.exports = serverlessConfiguration;
