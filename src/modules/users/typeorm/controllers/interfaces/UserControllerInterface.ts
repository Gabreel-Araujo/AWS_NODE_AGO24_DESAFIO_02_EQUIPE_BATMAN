import type { NextFunction, Request, Response } from "express";

export default interface UserControllerInterface {
  createUser(req: Request, res: Response, next: NextFunction): void;
  getUserById(req: Request, res: Response, next: NextFunction): void;
  deleteUserById(req: Request, res: Response): void;
  updateUser(req: Request, res: Response): void;
}
