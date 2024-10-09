import { dbConnection } from '@/lib/typeorm';
import AuthController from '@/modules/users/controllers/auth.controller';
import UserService from '@/modules/users/services/UserService';
import User from '@/modules/users/typeorm/entities/User';
import UserRepository from '@/modules/users/typeorm/repositories/UserRepository';
import { Router } from 'express';
import AuthService from '../services/AuthService';

const authRoute = Router();

const userRepository = new UserRepository(dbConnection.getRepository(User));
const userService = new UserService(userRepository);
const authService = new AuthService(userService);
const authController = new AuthController(authService);

authRoute.post('/login', authController.login);

export default authRoute;
