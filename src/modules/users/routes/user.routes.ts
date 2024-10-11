import { authenticate } from '@/http/middleware/auth';
import { Request, Response, Router } from 'express';
import UserService from '../services/UserService';
import {
	idUserSchema,
	postUserSchema,
	putUserSchema,
	queryParamsSchema,
} from './validators/UserValidators';
import validation from '@/http/middleware/validation';

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
	validation(idUserSchema, 'params'),
	async (req: Request, res: Response) => {
		const { id } = req.params;

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
