import { authenticate } from '@/http/middleware/auth';
import { Request, Response, Router } from 'express';
import UserService from '../services/UserService';
import { postUserSchema } from './validators/UserValidators';
import UnauthorizedError from '@/http/errors/unauthorized-error';
import validation from '@/http/middleware/validation';

const userRoute = Router();

const userService = new UserService();

userRoute.post(
	'/',
	authenticate,
	validation(postUserSchema, 'body'),
	async (req: Request, res: Response) => {
		const { email, fullName, password } = req.body;

		const user = {
			fullName,
			email,
			password,
		};
		const createdUser = await userService.save(user);

		if (!createdUser) {
			throw new UnauthorizedError('unauthorized');
		}

		res.status(201).json({ id: createdUser.id });
	},
);

export default userRoute;
