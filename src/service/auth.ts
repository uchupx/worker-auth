import {JWT, type JWT as JWT_TYPE} from "./jwt";

import app from "../config/app";
import {ErrorHandler} from "../helper/error";
import HttpStatusCode from "../helper/enums/http";
import type {Token} from "./auth.type";
import type {UserRepo} from "../repo/user";
import type {UserCreateModel, UserModel} from "../repo/user.type";
import type {ClientRepo} from "@app/repo/client.ts";

export class AuthService {
    private jwtService: JWT_TYPE
    private userRepo: UserRepo
    private clientRepo: ClientRepo

    constructor(userRepo: UserRepo, clientRepo: ClientRepo) {
        const config = app.getConfig

        this.jwtService = new JWT(config.key.public, config.key.private);
        this.userRepo = userRepo;
        this.clientRepo = clientRepo;

    }

    public async login(username: string, password: string, secret: string): Promise<Token> {
        const user = await this.userRepo.getUserByUsername(username, secret);

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

    public async register(username: string, email: string, password: string, secret: string): Promise<UserModel> {
        let client = await this.clientRepo.getClientBySecret(secret)
        if (!client) {
            throw new ErrorHandler("Invalid client secret", null, HttpStatusCode.UNAUTHORIZED)
        }
        let user = await this.userRepo.getUserByUsername(username, secret)
        if (user) {
            throw new ErrorHandler("Username already taken", null, HttpStatusCode.CONFLICT)
        }

        password = this.jwtService.hash(password)

        const userModel = {
            username: username,
            email: email,
            password: password,
            client_id: client.id,
        } as UserCreateModel

        return this.userRepo.createUser(userModel)
            .then((user) => {
                return user
            })
            .catch((err) => {
                throw new ErrorHandler(err.message, err, HttpStatusCode.INTERNAL_SERVER_ERROR)
            })
    }

    public isTokenValid(token: string): string {
        const result = this.jwtService.verifyToken(token) as any
        if (result.tokenExp) {
            throw new ErrorHandler("failed to decode token", result.err, HttpStatusCode.BAD_REQUEST)
        }
        if (!result.decode.id) {
            throw new ErrorHandler("failed to decode token", null, HttpStatusCode.INTERNAL_SERVER_ERROR)
        }

        return result.decode.id
    }
}
