declare global {
    namespace Express {
        export interface Request {
            token?: string
        }
    }
}

import type { NextFunction, Request, Response } from "express"

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization?.split(' ')[1]

    if (!bearerToken) {
        return res.status(401).json({message: "Unauthorized"})
    }



    req.token = bearerToken
    next()
}


export default authorization
