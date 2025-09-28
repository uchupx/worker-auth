import Joi, {type ObjectSchema} from "joi";

export type DefaultQuery = {
    Page: Number
    PerPage: Number
    Keyword?: String
}

export const DefaultQuerySchema: ObjectSchema = Joi.object({})


export const toLimitOffset = (q: DefaultQuery | null): {limit: Number, offset: Number} => {

    const res = {
        limit: 10,
        offset: 0
    }

    if (!q || Object.keys(q!).length < 1) {
        return res
    }

    if (q.PerPage.valueOf() > 0) {
        res.limit = q.PerPage.valueOf()
    }

    if (q.Page.valueOf() > 1) {
        res.offset = res.limit * q.Page.valueOf()
    }

    return res
}