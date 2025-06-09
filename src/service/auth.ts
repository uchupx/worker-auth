import { JWT, type JWT as JWT_TYPE } from "./jwt";

import app from "../config/app";
import type { Token } from "./auth.type";
import type { UserRepo } from "../repo/user";
import type { UserCreateModel } from "../repo/user.type";
import { ErrorHandler } from "../helper/error";
import HttpStatusCode from "../helper/enums/http";

export class AuthService {
  private jwtService: JWT_TYPE
  private userRepo: UserRepo

  constructor(userRepo: UserRepo) {
    const config = app.getConfig

    this.jwtService = new JWT(config.key.public, config.key.private);
    this.userRepo = userRepo;
  }

  public login(username: string, password: string): Token {
    const body = {
      username: username,
      email: 'hi@uchupx.tech'
    }

    const token = this.jwtService.encodeToken(body)

    return {
      token,
      duration: 3600
    }
  }

  public register(username: string, email: string, password: string): any {
    password = this.jwtService.hash(password)

    const userModel = {
      username: username,
      email: email,
      password: password
    } as UserCreateModel

    return this.userRepo.createUser(userModel)
      .then((user) => {
        return
      })
      .catch((err) => {
        throw new ErrorHandler(err.message, err, HttpStatusCode.INTERNAL_SERVER_ERROR)
      })
  }
}
