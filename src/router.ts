
import type { Request, Response } from "express"
import HttpStatusCode from "./helper/enums/http.ts"
import { successResponse } from "./helper/reqres"
import { log } from "./helper/logger"
import middleware from "./middleware"

import type { Config } from "./config/app"

export enum RouteMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put'
}

export type Route = {
  method: RouteMethod,
  path: string,
  needAuth?: boolean,
  func(req: Request, res: Response): any
}

export function InitRoute(app: any, config: Config) {
  const routes = [
    {
      method: RouteMethod.Get,
      path: "/version",
      func: (req: Request, res: Response): any => {
        res.status(HttpStatusCode.OK).send(config.app.version)
      }
    },
    {
      method: RouteMethod.Get,
      path: "/ping",
      needAuth: true,
      func: (req: Request, res: Response): any => {
        res.status(HttpStatusCode.OK).send(successResponse("pong !!!"))
      }
    }
  ] as Array<Route>

  log.info(`Initialize route`)

  routes.forEach(r => {
    r.needAuth = r.needAuth || false

    if (r.needAuth) {
      app[r.method](r.path, middleware.authorization, r.func)
    } else {
      app[r.method](r.path, r.func)
    }

    log.info(`Route : ${r.method.toUpperCase()}: ${r.path} -> ${r.func.name.replace('bound ', '')}`)
  })
}

