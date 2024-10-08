import { Request, Response } from "express";
import UserControllerInterface from "./interfaces/UserControllerInterface";
import UserServiceInterface from "../services/interfaces/UserServiceInterface";

export default class UserController implements UserControllerInterface {
  constructor(private service: UserServiceInterface) {}

  createUser = async (req: Request, res: Response) => {
    const user = req.body;
    const createdUser = await this.service.save(user);
    res.status(201).json({ id: createdUser.id });
  };
}
