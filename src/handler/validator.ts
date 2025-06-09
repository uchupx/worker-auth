import { ErrorHandler } from "../helper/error"
import HttpStatusCode from "../helper/enums/http"
import type { AnySchema } from "joi"

export function validate<T>(schema: AnySchema, data: any, acceptNull = false): [ErrorHandler | undefined, T] {
  if (!schema) {
    return [new ErrorHandler("schema is not valid", null, 500), undefined as T]
  }

  if (!acceptNull && (data === undefined || data === null)) {
    return [new ErrorHandler("body is undefined", null, HttpStatusCode.BAD_REQUEST), undefined as T]

  } else if (acceptNull && (data === undefined || data === null)) {
    return [undefined, {} as T]
  }

  const { error, value } = schema.validate(data)

  if (error) {
    return [new ErrorHandler(error.message, error, HttpStatusCode.BAD_REQUEST), undefined as T]
  }

  return [undefined, value as T]
}
