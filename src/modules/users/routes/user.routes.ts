import { authenticate } from '@/http/middleware/auth';
import { Request, Response, Router } from 'express';
import UserService from '../services/UserService';
import { idUserSchema, postUserSchema } from './validators/UserValidators';
import UnauthorizedError from '@/http/errors/unauthorized-error';
import validation from '@/http/middleware/validation';
import ValidationError from '@/http/errors/validation-error';

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

userRoute.get(
	'/:id',
	authenticate,
	validation(idUserSchema, 'params'),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id) {
			throw new ValidationError('Id not found');
		}

		const user = await userService.findById(id);
		res.status(200).json(user);
	},
);

export default userRoute;
