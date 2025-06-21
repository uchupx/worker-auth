import type { Request } from "express";
import type { Route } from "@app/router.rest";

export interface Handler {
  routes(): Array<Route>
}

export function BindRequest<T>(req: Request): T {
  return req.body as T
}

export function BindQuery<T>(req: Request): T {
  return req.query as T
}

