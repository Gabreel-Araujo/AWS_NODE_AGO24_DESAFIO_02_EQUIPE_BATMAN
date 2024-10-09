import type { NextFunction, Request, Response } from "express";
import type AuthControllerInterface from "./interfaces/AuthControllerInterface";
import type AuthService from "../services/AuthService";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export default class AuthController implements AuthControllerInterface {
  constructor(private service: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await this.service.authenticate(email, password);

      if (!user) return;

      const accessToken = jwt.sign(
        { id: user.id, fullName: user.fullName, email: user.email },
        env.SECRET_KEY,
        {
          expiresIn: "10m",
        }
      );

      res.status(200).json({ accessToken, expiresIn: 600 });
    } catch (e) {
      next(e);
    }
  };
}
