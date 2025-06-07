type response = {
  message?: string,
  data?: string,
  meta?: string
}
export function successResponse(data: any): response {
  return {
    message: "success",
    data: data
  }
}
