import express from 'express'
import { InitRoute } from './router'
import { log } from './helper/logger'
import App from './config/app'

const app = express()
const config = App.getConfig;
const port = config.app.port || 3000

app.use(express.json())

log.info(`App API env: ${config.app.env}`)
log.info(`App API version: ${config.app.version}`)

InitRoute(app, config)

app.listen(port, () => {
  log.info(`App API running at http://localhost:${port}`)
})
