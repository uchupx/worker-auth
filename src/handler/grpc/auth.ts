import { AuthService } from '@app/service/auth'
import type { Service } from '@app/service/interface'
import { UserService } from '@app/service/user'
import * as grpc from '@grpc/grpc-js'
import { log } from '@helper/logger'

export class AuthHandler {
  private authService: AuthService
  private userService: UserService

  constructor(authService: Service | undefined, userService: Service | undefined) {
    if (!authService || !(authService instanceof AuthService)) {
      throw new Error("AuthHandler [GRPC] required an instance of AuthService")
    }
    if (!userService || !(userService instanceof UserService)) {
      throw new Error("AuthHandler [GRPC] required an instance of UserService")
    }

    this.authService = authService
    this.userService = userService
  }

  public async getUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    let token = call.request.token as string

    if (!token) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        message: "token is required"
      })
    }

    try {
      const id = this.authService.isTokenValid(token)
      const user = await this.userService.getUser(id)
      callback(null, {
        username: user.username,
        email: user.email,
          id: id,
      })
    } catch (err) {
      log.error("failed to parse token", err)
      callback({
        code: grpc.status.UNAUTHENTICATED,
        message: "something error"
      })
    }
  }

  public async login(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
      let username = call.request.username as string
      let password = call.request.password as string
      let secret = call.request.secret as string


      if (!username ||!password ||!secret) {
          callback({
              code: grpc.status.INVALID_ARGUMENT,
              message: "username, password, and secret are required"
          })
      }

      try {
          const token = await this.authService.login(username, password, secret)
          console.log("login successful", token)
          callback(null, {
              token: token.token
          })
      } catch (err) {
          log.error("failed to login user", err)
          callback({
              code: grpc.status.INTERNAL,
              message: "something error"
          })
      }
  }


  public async register(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
      let username = call.request.username as string
      let email = call.request.email as string
      let password = call.request.password as string
      let secret = call.request.secret as string

      if (!username ||!password ||!secret) {
          return callback({
              code: grpc.status.INVALID_ARGUMENT,
              message: "username, email, password, and secret are required"
          })
      }

      try {
          const result = await this.authService.register(username, email, password, secret)
          callback(null, {
              id: result.id,
          })
          return
      } catch (err) {
          log.error("failed to register user", err)
          callback({
              code: grpc.status.INTERNAL,
              message: "something error"
          })
      }
  }
}



