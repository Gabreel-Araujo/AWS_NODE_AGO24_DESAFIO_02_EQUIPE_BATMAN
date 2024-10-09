import UnauthorizedError from '@/http/errors/unauthorized-error';
import type { Request, Response } from 'express';
import type UserServiceInterface from '../services/interfaces/UserServiceInterface';
import { postUserSchema } from './validators/UserValidators';

export default class UserController {
	constructor(private service: UserServiceInterface) {}

	createUser = async (req: Request, res: Response) => {
		const { email, fullName, password } = req.body;

		const validatedUser = postUserSchema.parse({
			email,
			fullName,
			password,
		});

		const createdUser = await this.service.save(validatedUser);

		if (!createdUser) {
			throw new UnauthorizedError('unauthorized');
		}

		res.status(201).json({ id: createdUser.id });
	};
}
