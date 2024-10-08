import { Request, Response } from "express";

export default interface UserControllerInterface {
  createUser(req: Request, res: Response): void;
}
