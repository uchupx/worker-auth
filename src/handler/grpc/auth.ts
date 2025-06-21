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
        email: user.email
      })
    } catch (err) {
      log.error("failed to parse token", err)
      callback({
        code: grpc.status.UNAUTHENTICATED,
        message: "something error"
      })
    }
  }
}



