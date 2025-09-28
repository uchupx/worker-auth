export const pagianationQuery = (query: string, limit: number, offset: number): string => {
    query = query.replaceAll("__limit__", limit.toString())
    query = query.replaceAll("__offset__", offset.toString())

    return query
}