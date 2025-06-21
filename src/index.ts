import express from 'express'
import * as grpc from '@grpc/grpc-js'
import { InitRoute } from './router.rest'
import { log } from './helper/logger'
import App, { type Config } from './config/app'
import { protos } from '@grpcApi/loader'
import { InitRouteGRPC } from './router.grpc'



function startServer(config: Config) {
  const app = express()
  const port = config.app.port || 3000

  app.use(express.json())

  log.info(`App API env: ${config.app.env}`)
  log.info(`App API version: ${config.app.version}`)

  InitRoute(app, config)

  app.listen(port, () => {
    log.info(`App Rest API running at http://0.0.0.0:${port}`)
  })
}

function sayHello(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const name = call.request.token || 'World';
  callback(null, { message: `Hello, ${name}!` });
}

function startGrpcServer(config: Config) {
  const app = new grpc.Server();
  const port = config.app.grpc_port || 8000

  InitRouteGRPC(app, config)
  app.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      log.error('Server failed to start:', err)
      return;
    }
    log.info(`App Grpc API running at http://0.0.0.0:${port}`);
  });
}


const config = App.getConfig;
startServer(config);
startGrpcServer(config);
