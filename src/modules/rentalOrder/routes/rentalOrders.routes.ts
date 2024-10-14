import { Request, Response, Router } from 'express';
import validation from '@/http/middleware/validation';
import { authenticate } from '@/http/middleware/auth';
import { ICreateRentalOrder } from '../typeorm/entities/interfaces/RentalOrderInterface';
import RentalOrderService from '../services/RentalOrderService';
import { postOrderSchema } from './validators/RentalOrdersValidators';

const ordersRouter = Router();

const ordersService = new RentalOrderService();

ordersRouter.use(authenticate);

// ordersRouter.get('/');

// ordersRouter.get('/:id');

ordersRouter.post(
	'/',
	validation(postOrderSchema, 'body'),
	async (req: Request, res: Response) => {
		const { car_id, customer_id } = req.body;

		const order: ICreateRentalOrder = {
			car_id,
			customer_id,
		};

		const createdOrder = await ordersService.create(order);

		res.status(201).json({ id: createdOrder.id });
	},
);

ordersRouter.delete('/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	await ordersService.softDeleteById(id);

	res.status(204).send();
});

//ordersRouter.put('/:id');

export default ordersRouter;
