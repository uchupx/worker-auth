import { services } from "@service/index";
import { AuthHandler } from "./auth";
import type { Handler } from "./interface";



export const handlers = (): {[key: string]: Handler} => {
  const svc = services()
  const authService = svc.auth

  return {
    auth: (new AuthHandler(authService)),
  }
} 
