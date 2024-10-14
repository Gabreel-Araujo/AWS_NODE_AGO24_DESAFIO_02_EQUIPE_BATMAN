import { Request, Response, Router } from 'express';
import validation from '@/http/middleware/validation';
import { authenticate } from '@/http/middleware/auth';
import { ICreateRentalOrder } from '../typeorm/entities/interfaces/RentalOrderInterface';
import RentalOrderService from '../services/RentalOrderService';
import {
	postOrderSchema,
	updateOrderSchema,
	validateCep,
} from './validators/RentalOrdersValidators';

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
			car_id,
			customer_id,
		};

		const createdOrder = await ordersService.save(order);

		res.status(201).json({ id: createdOrder.id });
	},
);

ordersRouter.put(
	'/:id',
	validation(updateOrderSchema, 'body'),
	async (req: Request, res: Response) => {
		const { status, cep, start_date, end_date, cancellation_date } = req.body;

		const order: {
			status?: string;
			cep: string;
			start_date: Date;
			end_date: Date;
			cancellation_date?: Date;
			city?: string;
			state?: string;
			rental_rate?: number;
		} = {
			status,
			cep,
			start_date,
			end_date,
			cancellation_date,
		};

		if (cep) {
			const { localidade, uf, rentalRate } = await validateCep(cep);
			order.city = localidade;
			order.state = uf;
			order.rental_rate = rentalRate;
		}

		await ordersService.update(req.params.id, order);
		res.status(204).send();
	},
);

//ordersRouter.delete('/:id',);

export default ordersRouter;
