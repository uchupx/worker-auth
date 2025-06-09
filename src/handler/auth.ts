import type { Request, Response } from "express"
import { RouteMethod, type Route } from "../router"
import { errorResponse, successResponse } from "./response"
import { AuthService } from "../service/auth"
import { validate } from "./validator"
import { LoginRequestSchema, RegisterRequestSchema, type LoginRequest, type RegisterRequest } from "./auth.type"
import type { Service } from "../service/interface"


export class AuthHandler {
  static readonly path = "/auth"

  private readonly service: AuthService
  constructor(service: Service | undefined) {
    if (!service || !(service instanceof AuthService)) {
      throw new Error("AuthHandler requires an instance of AuthService")
    }

    this.service = service
  }

  routes(): Array<Route> {
    return [
      {
        method: RouteMethod.Post,
        path: AuthHandler.path,
        func: this.login.bind(this),
      },
      {
        method: RouteMethod.Post,
        path: `${AuthHandler.path}/register`,
        func: this.register.bind(this),
      }
    ] as Array<Route>
  }

  public login(req: Request, res: Response): void {
    const [err, body] = validate<LoginRequest>(LoginRequestSchema, req.body)
    if (err) {
      return errorResponse(res, err)
    }

    this.service.login(body.username, body.password)
      .then((token) => {
        return successResponse(res, 200, token)
      }).catch((err: any) => {
        return errorResponse(res, err)
      })
  }

  public register(req: Request, res: Response): void {
    const [err, body] = validate<RegisterRequest>(RegisterRequestSchema, req.body)
    if (err) {
      return errorResponse(res, err)
    }

    return this.service.register(body.username, body.email, body.password).then(() => {
      successResponse(res, 201, "User registered successfully")
    }).catch((err: any) => {
      errorResponse(res, err)
    })
  }
}
