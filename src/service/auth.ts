import { JWT, type JWT as JWT_TYPE } from "./jwt";

import app from "../config/app";
import { ErrorHandler } from "../helper/error";
import HttpStatusCode from "../helper/enums/http";
import type { Token } from "./auth.type";
import type { UserRepo } from "../repo/user";
import type { UserCreateModel } from "../repo/user.type";

export class AuthService {
  private jwtService: JWT_TYPE
  private userRepo: UserRepo

  constructor(userRepo: UserRepo) {
    const config = app.getConfig

    this.jwtService = new JWT(config.key.public, config.key.private);
    this.userRepo = userRepo;
  }

  public async login(username: string, password: string): Promise<Token> {
    const user = await this.userRepo.getUserByUsername(username);

    if (!user) {
      throw new ErrorHandler("User not found", null, HttpStatusCode.BAD_REQUEST);
    }

    if (!this.jwtService.verifyHash(user.password!, password)) {
      throw new ErrorHandler("Invalid password", null, HttpStatusCode.UNAUTHORIZED);
    }

    delete user.password; // Remove password from user object

    const token = this.jwtService.encodeToken(user)

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
