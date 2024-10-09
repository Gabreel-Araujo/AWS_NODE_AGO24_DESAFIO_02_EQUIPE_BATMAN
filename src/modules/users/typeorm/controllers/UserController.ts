import type { NextFunction, Request, Response } from "express";
import type UserControllerInterface from "./interfaces/UserControllerInterface";
import type UserServiceInterface from "../services/interfaces/UserServiceInterface";
import { postUserSchema } from "./validators/UserValidators";

export default class UserController implements UserControllerInterface {
  constructor(private service: UserServiceInterface) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, fullName, password } = req.body;

      const validatedUser = postUserSchema.parse({
        email,
        fullName,
        password,
      });

      const createdUser = await this.service.save(validatedUser);

      if (!createdUser) throw new Error("internal server error");

      res.status(201).json({ id: createdUser.id });
    } catch (e: unknown) {
      next(e);
    }
  };
}
