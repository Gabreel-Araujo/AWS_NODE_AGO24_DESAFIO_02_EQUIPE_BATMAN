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

      if (!createdUser) return;

      res.status(201).json({ id: createdUser.id });
    } catch (e: unknown) {
      next(e);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;

    if (!userId) {
      throw new Error("User not found");
    }

    try {
      const user = await this.service.findById(userId);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  deleteUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
      await this.service.softDeleteUser(userId);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "User not found" });
    }
  };
}
