import type { NextFunction, Request, Response } from "express"

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    next()
}


export default authorization
