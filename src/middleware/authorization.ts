declare global {
    namespace Express {
        export interface Request {
            token?: string
        }
    }
}

import type {NextFunction, Request, Response} from "express"

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    const m = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)
    if (!m) {
        res.setHeader('WWW-Authenticate', 'Bearer')
        return res.status(401).json({message: "Unauthorized"})
    }

    req.token = m[1]


    next()
}


export default authorization
