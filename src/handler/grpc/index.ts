import { services } from "@service/index";
import { AuthHandler } from "./auth";
import type { Handler } from "./interface";
import { protos } from "./loader";
import { log } from "@helper/logger";

export type GrpcHandler = {
  authHandler: AuthHandler
}

export const handlers = (): GrpcHandler => {
  try {
    const svc = services()
    const authService = svc.auth
    const userService = svc.user
    return {
      authHandler: (new AuthHandler(authService, userService))
    }
  } catch (err) {
    log.error(err)
    process.exit(0)
  }
} 
