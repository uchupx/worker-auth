type ServiceConfig = {
  host: string;
  port?: number;
}

export type Config = {
  database: {
    username: string;
    password: string;
    host: string;
    port: number;
    database: string;
  },
  redis: {
    url: string;
  },
  app: {
    port: number;
    env: 'development' | 'production';
    version: string;
  }
  service: {
    user: ServiceConfig;
  }
}

const projectPath = `${__dirname}/../../`;

function getConfig(): Config {
  const fs = require('fs')
  const version = fs.readFileSync(projectPath + '/version', 'utf8')

  let conf = JSON.parse(fs.readFileSync(projectPath + '/.env.json', 'utf8')) as Config

  conf.app.version = version.replace('\n', '')
  return conf;
}

export default {
  getConfig: getConfig(),
  path: projectPath,
  env: getConfig().app.env
}

