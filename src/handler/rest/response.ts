import type {Request, Response} from "express"
import {ErrorHandler as ErrorHandlerType} from "@helper/error"
import type {DefaultQuery} from "@app/types/request.ts";
import {getUrl} from "@helper/reqres.ts";

type response = {
    message?: string,
    data?: any,
    meta?: any
}

export function successResponse(res: Response, code: number = 200, data: any, meta?: any): any {
    return res.status(code).json({
        message: "success",
        data: data,
        meta: meta,
    } as response)
}

export function paginationResponse(req: Request, res: Response, code: number = 200, data: any, query: DefaultQuery): any {
    const meta = {
        perPage: query.PerPage ? query.PerPage.valueOf() : 10,
        page: query.Page ? query.Page.valueOf() : 1,
        totalPage: 0,
        nextPage: '',
        prevPage: ''
    }


    if (meta.page > 1) {
        meta.prevPage = getUrl(req)
    }

    if (meta.page < meta.totalPage) {
        meta.nextPage = getUrl(req)
    }

    return successResponse(res, code, data, meta)
}

export function errorResponse(res: Response, error: ErrorHandlerType | Error): any {
    let code = 500
    let message = "Internal Server Error"

    if (error instanceof ErrorHandlerType) {
        code = error.getCode()
        message = error.getMessage()
    } else {
        code = 500
    }

    return res.status(code).json({
        message: "error",
        data: {
            message: message,
        }
    } as response)
}
