import { Router } from "express";
import UserController from "../controllers/UserController";
import UserService from "../services/UserService";
import { dbConnection } from "@/lib/typeorm";
import UserRepository from "../repositories/UserRepository";
import User from "../entities/User";
import { authenticate } from "@/modules/authentication/middlewares/AuthMiddleware";

const route = Router();

const userRepository = new UserRepository(dbConnection.getRepository(User));
const userService = new UserService(userRepository);
const userController = new UserController(userService);

route.post("/users", authenticate, userController.createUser);
route.get("/users/:id", userController.getUserById);

export default route;
