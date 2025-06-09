import fs from 'fs';
import { log } from '../helper/logger.ts';
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

  key: {
    public: string;
    private: string;
  },
}

const projectPath = `${__dirname}/../../`;

function getConfig(): Config {
  const fs = require('fs')
  const version = fs.readFileSync(projectPath + '/version', 'utf8')

  let conf = JSON.parse(fs.readFileSync(projectPath + '/.env.json', 'utf8')) as Config

  conf.app.version = version.replace('\n', '')

  conf.key = {
    public: '',
    private: ''
  }

  conf.key.public = getPublicKey()
  conf.key.private = getPrivateKey()

  return conf;
}


function getPublicKey(): string {
  const publicKeyPath = projectPath + '/api_public.pem'
  if (!fs.existsSync(publicKeyPath)) {
    log.error("File Public Key not found at " + publicKeyPath)
    process.exit(1)
  }

  return fs.readFileSync(publicKeyPath, 'utf8').replace(/\\n/gm, '\n');
}


function getPrivateKey(): string {
  const privateKeyPath = projectPath + '/api_private.pem'
  if (!fs.existsSync(privateKeyPath)) {
    log.error("File Public Key not found at " + privateKeyPath)
    process.exit(1)
  }

  return fs.readFileSync(privateKeyPath, 'utf8').replace(/\\n/gm, '\n');
}

export default {
  getConfig: getConfig(),
  path: projectPath,
  env: getConfig().app.env
}

