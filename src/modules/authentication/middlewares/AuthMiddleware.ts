import { ApiError } from "@/http/errors/api-error";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.get("Authorization");
    const token = auth?.startsWith("Bearer") ? auth.split(" ")[1] : null;
    console.log(auth)

    if (!token) throw new ApiError("invalid token", 403);

    jwt.verify(token, env.SECRET_KEY, (error) => {
      if (error) throw new ApiError("invalid token", 403);
    });

    next();
  } catch (error) {
    next(error);
  }
}
