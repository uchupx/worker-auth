import {services} from "@app/service";

declare global {
    namespace Express {
        export interface Request {
            token?: string
        }
    }
}

import type {NextFunction, Request, Response} from "express"
import type {Service} from "@service/interface.ts";
import type {AuthService} from "@service/auth.ts";
import {errorResponse} from "@restApi/response.ts";
import {ErrorHandler} from "@helper/error.ts";

let svc = null as {[p:string]: Service} | null

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    if (svc == null) {
        svc = services()
    }
    const authSvc = svc.auth  as AuthService

    const m = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)
    if (!m) {
        res.setHeader('WWW-Authenticate', 'Bearer')
        return errorResponse(res, new ErrorHandler("unauthorized", null, 401))
    }

    const token = m[1]!

    try {
        await authSvc.isTokenValid(token)

        req.token = token

        next()
    } catch (e) {
       return errorResponse(res, new ErrorHandler("unauthorized", null, 401))
    }


}


export default authorization
