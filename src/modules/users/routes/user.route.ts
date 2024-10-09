import { authenticate } from '@/http/middleware/auth';
import { dbConnection } from '@/lib/typeorm';
import { Router } from 'express';
import UserController from '../controllers/user.controller';
import UserService from '../services/UserService';
import User from '../typeorm/entities/User';
import UserRepository from '../typeorm/repositories/UserRepository';

const userRoute = Router();

const userRepository = new UserRepository(dbConnection.getRepository(User));
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRoute.post('/users', authenticate, userController.createUser);

export default userRoute;
