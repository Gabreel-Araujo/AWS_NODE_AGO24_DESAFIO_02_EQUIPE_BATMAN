import { Router } from "express";
import AuthController from "../controllers/AuthController";
import AuthService from "../services/AuthService";
import UserService from "@/modules/users/typeorm/services/UserService";
import UserRepository from "@/modules/users/typeorm/repositories/UserRepository";
import { dbConnection } from "@/lib/typeorm";
import User from "@/modules/users/typeorm/entities/User";

const route = Router();

const userRepository = new UserRepository(dbConnection.getRepository(User));
const userService = new UserService(userRepository);
const authService = new AuthService(userService);
const authController = new AuthController(authService);

route.post("/login", authController.login);

export default route;
