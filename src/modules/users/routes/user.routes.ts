import { authenticate } from '@/http/middleware/auth';
import { Request, Response, Router } from 'express';
import UserService from '../services/UserService';
import {
	idUserSchema,
	postUserSchema,
	putUserSchema,
	queryParamsSchema,
} from './validators/UserValidators';
import UnauthorizedError from '@/http/errors/unauthorized-error';
import validation from '@/http/middleware/validation';
import ValidationError from '@/http/errors/validation-error';
import { UserDetailsInterface } from '../typeorm/entities/interfaces/UserInterface';
import User from '../typeorm/entities/User';
import { IsNull, Not } from 'typeorm';

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
	'/',
	authenticate,
	validation(queryParamsSchema, 'query'),
	async (req: Request, res: Response) => {
		const { page, limit, name, email, deleted, sortBy, sortOrder } = req.query;

		console.log('req query', req.query);

		const filters: any = {};

		if (typeof name === 'string') {
			filters.fullName = name;
		}
		if (typeof email === 'string') {
			filters.email = email;
		}

		Object.assign(filters, { deletedAt: deleted });

		const [users, total] = await userService.findUsers(filters, {
			page: Number(page),
			limit: Number(limit),
			sortBy: typeof sortBy === 'string' ? sortBy : 'createdAt',
			sortOrder:
				typeof sortOrder === 'string'
					? (sortOrder.toUpperCase() as 'ASC' | 'DESC')
					: 'ASC',
		});

		if (users.length === 0) {
			res.status(404).json({ message: 'No users found' });
			return;
		}

		const selectedProperties = users.map((user) => ({
			id: user.id,
			name: user.fullName,
			email: user.email,
			deletedAt: user.deletedAt,
			createdAt: user.createdAt,
		}));

		res.json({
			page: Number(page),
			limit: Number(limit),
			total,
			users: selectedProperties,
		});
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

userRoute.delete(
	'/:id',
	authenticate,
	validation(idUserSchema, 'params'),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await userService.softDeleteUser(id);
		res.status(204).send();
	},
);

userRoute.put(
	'/:id',
	authenticate,
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

		if (!updateUser) {
			res.status(404).json({ message: 'User Not found' });
		}

		res.status(200).json(updateUser);
	},
);

export default userRoute;
