import type { ObjectSchema } from "joi";
import Joi from "joi";

export type LoginRequest = {
  username: string;
  password: string;
  secret: string;
}

export const LoginRequestSchema: ObjectSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  secret: Joi.string().required(),
})


export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  secret: string;
}

export const RegisterRequestSchema: ObjectSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include letters, numbers, and symbols.",
    }),
    secret: Joi.string().required(),
})
