import type { NextFunction, Request, Response } from "express";
import type UserControllerInterface from "./interfaces/UserControllerInterface";
import type UserServiceInterface from "../services/interfaces/UserServiceInterface";
import { postUserSchema } from "./validators/UserValidators";
import type { UserDetailsInterface } from "../entities/interfaces/UserInterface";

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

  updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updateData = req.body;
    try {
      const updateUser = await this.service.updateUser(userId, updateData);
      if (!updateUser) {
        res.status(404).json({ message: "User Not found" });
      }
      res.status(200).json(updateUser);
    } catch (error) {
      if (error) {
        res.status(500);
      }
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    const users: UserDetailsInterface[] = await this.service.findUsers(
      page,
      limit
    );

    if (!users) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    const selectedProperties = users.map((user) => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      password: user.password,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
    }));

    res.json(selectedProperties);
  };
}
