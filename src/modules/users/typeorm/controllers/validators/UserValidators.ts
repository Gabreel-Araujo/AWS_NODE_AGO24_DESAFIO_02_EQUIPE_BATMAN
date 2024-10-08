import { z } from "zod";

export const postUserSchema = z.object({
  fullName: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string",
    })
    .refine((name) => name.trim() !== "", {
      message: "name cannot be null",
    }),
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email must be a string",
    })
    .email({
      message: "invalid email address",
    }),
  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password must be a string",
    })
    .min(8, "password must be at least 8 characters long'"),
});
