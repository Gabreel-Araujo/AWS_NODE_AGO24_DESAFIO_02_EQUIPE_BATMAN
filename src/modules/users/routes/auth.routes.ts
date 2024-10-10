import { Request, Response, Router } from 'express';
import AuthService from '../services/AuthService';
import ValidationError from '@/http/errors/validation-error';
import UnauthorizedError from '@/http/errors/unauthorized-error';
import jwt from 'jsonwebtoken';
import { env } from '@/env';

const authRoute = Router();

const authService = new AuthService();

authRoute.post('/login', async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email) {
		throw new ValidationError('email is required');
	}

	if (!password) {
		throw new ValidationError('password is required');
	}

	const user = await authService.authenticate(email, password);

	if (!user) {
		throw new UnauthorizedError('invalid email or password');
	}

	const expiresIn = '10m';
	const accessToken = jwt.sign(
		{ id: user.id, fullName: user.fullName, email: user.email },
		env.SECRET_KEY,
		{
			expiresIn,
		},
	);

	res.status(200).json({ accessToken, expiresIn });
});

export default authRoute;
