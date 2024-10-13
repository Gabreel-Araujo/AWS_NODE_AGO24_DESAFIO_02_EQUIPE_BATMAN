import { Request, Response, Router } from 'express';
import validation from '@/http/middleware/validation';
import { authenticate } from '@/http/middleware/auth';
import { ICreateRentalOrder } from '../typeorm/entities/interfaces/RentalOrderInterface';
import RentalOrderService from '../services/RentalOrderService';
import { postOrderSchema } from './validators/RentalOrdersValidators';

const ordersRouter = Router();

const ordersService = new RentalOrderService();

//ordersRouter.use(authenticate);

// customersRouter.get('/');

// customersRouter.get('/:id');

ordersRouter.post(
	'/',
	//authenticate,
	validation(postOrderSchema, 'body'),
	async (req: Request, res: Response) => {
		const { car_id, customer_id } = req.body;

		const order: ICreateRentalOrder = {
            car_id, customer_id,
        };

		const createdOrder = await ordersService.save(order);

		res.status(201).json({ id: createdOrder.id });
	},
);

//ordersRouter.put('/:id');

//ordersRouter.delete('/:id',);

export default ordersRouter;
