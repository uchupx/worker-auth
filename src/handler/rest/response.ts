import type { Response } from "express"
import { ErrorHandler as ErrorHandlerType} from "@helper/error"

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

export function errorResponse(res: Response, error: ErrorHandlerType | Error): any {
  let code = 500
  let message = "Internal Server Error"

  if (error instanceof ErrorHandlerType) {
    code = error.getCode()
    message = error.getMessage()
  } else if (error instanceof Error) {
    code = 500 
  }

  return res.status(code).json({
    message: "error",
    data: {
      message: message,
    }
  } as response)
}
