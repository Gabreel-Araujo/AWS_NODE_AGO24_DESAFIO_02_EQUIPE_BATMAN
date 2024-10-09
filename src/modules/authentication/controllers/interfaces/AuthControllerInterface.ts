import type { NextFunction, Request, Response } from "express";

export default interface AuthControllerInterface {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
}
