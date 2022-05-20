import type Serverless from 'serverless/index';

const readTsFileWithTsNode = async () => {
  const sls = await import('./serverless');
  console.log(sls);
  // @ts-ignore any de ses morts
  // eslint-disable-next-line
  console.log(new sls.default.custom.myClass('my string').getSavedString());
};

const serverlessCdk = (serverless: Serverless) => {
  console.log('Coucou');
  readTsFileWithTsNode()
    .then(() => console.log('hi'))
    .catch(() =>
      console.log(`err: ${JSON.stringify(serverless.service.custom)}`),
    );
};

class serverlessCdkClass {
  constructor(private serverless: Serverless) {}

  hooks: { [key: string]: () => void } = {
    'package:compileEvents': () => serverlessCdk(this.serverless),
  };
}

module.exports = serverlessCdkClass;
