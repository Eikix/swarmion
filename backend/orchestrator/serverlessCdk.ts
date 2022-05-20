import type Serverless from 'serverless/index';

const resolveConfigPath = require('serverless/lib/cli/resolve-configuration-path');

const readTsFileWithTsNode = async () => {
  const configPath = await resolveConfigPath();
  console.log(configPath);
  const sls = await require(configPath);
  console.log(sls);
  // @ts-ignore any de ses morts
  // eslint-disable-next-line
  console.log(new sls.custom.myClass('my string').getSavedString());
};

const serverlessCdk = (_serverless: Serverless) => {
  console.log('Coucou');
  readTsFileWithTsNode()
    .then(() => console.log('hi'))
    .catch((err) =>
      console.log(`err: ${JSON.stringify(err)}`),
    );
};

class serverlessCdkClass {
  constructor(private serverless: Serverless) {}

  hooks: { [key: string]: () => void } = {
    'package:compileEvents': () => serverlessCdk(this.serverless),
  };
}

module.exports = serverlessCdkClass;
