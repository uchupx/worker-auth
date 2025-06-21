import { repos } from "../repo"
import type { UserRepo } from "../repo/user"
import { AuthService } from "./auth"
import type { Service } from "./interface"
import { UserService } from "./user"

export const services = (): { [key: string]: Service } => {
  const repo = repos()
  const userRepo = repo.userRepo as UserRepo

  return {
    auth: (new AuthService(userRepo)),
    user: (new UserService(userRepo))
  }
}
