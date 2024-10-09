import { authenticate } from '@/http/middleware/auth';
import { Request, Response, Router } from 'express';
import UserService from '../services/UserService';
import { postUserSchema } from './validators/UserValidators';
import UnauthorizedError from '@/http/errors/unauthorized-error';

const userRoute = Router();

const userService = new UserService();

userRoute.post('/', authenticate, async (req: Request, res: Response) => {
	const { email, fullName, password } = req.body;

	const validatedUser = postUserSchema.parse({
		email,
		fullName,
		password,
	});

	const createdUser = await userService.save(validatedUser);

	if (!createdUser) {
		throw new UnauthorizedError('unauthorized');
	}

	res.status(201).json({ id: createdUser.id });
});

export default userRoute;
