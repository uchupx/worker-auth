import {JWT, type JWT as JWT_TYPE} from "./jwt";

import app from "@app/config/app";
import type {UserRepo} from "@app/repo/user";
import type {UserModel} from "@app/repo/user.type";

export class UserService {
    private userRepo: UserRepo
    private jwtService: JWT_TYPE

    constructor(userRepo: UserRepo) {
        const config = app.getConfig

        this.userRepo = userRepo
        this.jwtService = new JWT(config.key.public, config.key.private)
    }


    public async getUser(id: string): Promise<UserModel> {
        const user = await this.userRepo.getUserById(id)
        if (user === null) {
            throw new Error("User not found")
        }

        delete user.password

        return user
    }


    public async changePassword(id: string, oldPassword: string, newPassword: string): Promise<UserModel> {
        const user = await this.userRepo.getUserById(id)
        if (user === null) {
            throw new Error("User not found")
        }

        if (!this.jwtService.verifyHash(user.password!, oldPassword)) {
            throw new Error("Invalid old password")
        }

        user.password = this.jwtService.hash(newPassword)
        await this.userRepo.updatePassword(user)

        return user
    }
}
