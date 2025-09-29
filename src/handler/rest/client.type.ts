import Joi, {type ObjectSchema} from "joi";

export type ClientAddRequest = {
    name: string;
    urls: Array<string>;
}


export const ClientAddSchema: ObjectSchema = Joi.object({
    name: Joi.string().required(),
    urls: Joi.array().required()
})
