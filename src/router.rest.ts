
import type { Application, Request, Response } from "express"
import HttpStatusCode from "./helper/enums/http.ts"
import { successResponse } from "./handler/rest/response.ts"
import { log } from "./helper/logger.ts"
import middleware from "./middleware/index.ts"

import type { Config } from "./config/app.ts"
import { handlers } from "./handler/rest/index"

export enum RouteMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
}

export type Route = {
  method: RouteMethod,
  path: string,
  needAuth?: boolean,
  func(req: Request, res: Response): any
}

export function InitRoute(app: Application, config: Config) {
  const routes = [
    {
      method: RouteMethod.Get,
      path: "/version",
      func: (_req: Request, res: Response): any => {
        successResponse(res, HttpStatusCode.OK, config.app.version)
      }
    },
    {
      method: RouteMethod.Get,
      path: "/ping",
      needAuth: true,
      func: (_req: Request, res: Response): any => {
        successResponse(res, HttpStatusCode.OK, "pong")
      }
    }
  ] as Array<Route>

  log.info(`Initialize route`)
  const handler = handlers()
  for (const idx in handler) {
    if (!handler[idx] || !handler[idx].routes) {
      log.warn(`Handler ${idx} does not have routes method, skipping`)
      continue
    }

    routes.push(...handler[idx].routes())
  }

  routes.forEach(r => {
    r.needAuth = r.needAuth || false

    if (r.needAuth) {
      // @ts-ignore
        app[r.method](r.path, middleware.authorization, r.func)
    } else {
      app[r.method](r.path, r.func)
    }

    log.info(`Route Rest API : ${r.method.toUpperCase()}: ${r.path} -> ${r.func.name.replace('bound ', '')}`)
  })
}

