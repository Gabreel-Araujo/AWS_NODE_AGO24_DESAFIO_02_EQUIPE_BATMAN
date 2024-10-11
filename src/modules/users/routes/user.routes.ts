import { authenticate } from '@/http/middleware/auth';
import { Request, Response, Router } from 'express';
import UserService from '../services/UserService';
import {
	idUserSchema,
	postUserSchema,
	putUserSchema,
} from './validators/UserValidators';
import UnauthorizedError from '@/http/errors/unauthorized-error';
import validation from '@/http/middleware/validation';
import ValidationError from '@/http/errors/validation-error';

const userRoute = Router();

const userService = new UserService();

userRoute.use(authenticate);

userRoute.post(
	'/',
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

userRoute.delete(
	'/:id',
	validation(idUserSchema, 'params'),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await userService.softDeleteUser(id);
		res.status(204).send();
	},
);

userRoute.put(
	'/:id',
	validation(idUserSchema, 'params'),
	validation(putUserSchema, 'body'),
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { fullName, email, password } = req.body;

		const updateUser = await userService.updateUser(id, {
			fullName,
			email,
			password,
		});

		res.status(200).json(updateUser);
	},
);

export default userRoute;
