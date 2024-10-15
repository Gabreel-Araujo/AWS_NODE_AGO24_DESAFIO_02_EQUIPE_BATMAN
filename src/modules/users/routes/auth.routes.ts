import { env } from '@/env';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import AuthService from '../services/AuthService';

const authRoute = Router();

const authService = new AuthService();

authRoute.post('/login', async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await authService.authenticate(email, password);

	const expiresIn = '10m';
	const accessToken = jwt.sign(
		{ id: user?.id, fullName: user?.fullName, email: user?.email },
		env.SECRET_KEY,
		{
			expiresIn,
		},
	);

	res.status(200).json({ accessToken, expiresIn });
});

export default authRoute;
