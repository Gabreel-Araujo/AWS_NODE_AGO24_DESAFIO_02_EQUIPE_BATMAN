import { Request, Response, Router } from 'express';
import validation from '@/http/middleware/validation';
import { authenticate } from '@/http/middleware/auth';
import { ICreateRentalOrder } from '../typeorm/entities/interfaces/RentalOrderInterface';
import RentalOrderService from '../services/RentalOrderService';
import {
	postOrderSchema,
	updateOrderSchema,
	validateCep,
	queryParamsSchema,
	getIdOrderSchema,
} from './validators/RentalOrdersValidators';

const ordersRouter = Router();

const ordersService = new RentalOrderService();

//ordersRouter.use(authenticate);

ordersRouter.get(
	'/:id',
	validation(getIdOrderSchema, 'params'),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const order = await ordersService.findById(id);

		res.status(200).json(order);
	},
);

ordersRouter.get(
	'/',
	validation(queryParamsSchema),
	async (req: Request, res: Response) => {
		const filters = {
			status: req.query.status,
			customer_cpf: req.query.customer_cpf,
			start_date: req.query.start_date
				? new Date(req.query.start_date as string)
				: undefined,
			end_date: req.query.end_date
				? new Date(req.query.end_date as string)
				: undefined,
		};

		const pagination = {
			page: Number.parseInt(req.query.page as string) || 1,
			limit: Number.parseInt(req.query.limit as string) || 10,
		};

		const { data, total } = await ordersService.getAllOrders(
			filters,
			pagination,
		);

		res.status(200).json({
			total,
			currentPage: pagination.page,
			totalPages: Math.ceil(total / pagination.limit),
			data,
		});
	},
);

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

ordersRouter.delete(
	'/:id',
	validation(getIdOrderSchema),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await ordersService.softDeleteById(id);

		res.status(204).send();
	},
);

ordersRouter.put(
	'/:id',
	validation(updateOrderSchema, 'body'),
	async (req: Request, res: Response) => {
		const {
			status,
			cep,
			start_date,
			end_date,
			cancellation_date,
			closing_date,
		} = req.body;

		const order: {
			status?: string;
			cep: string;
			start_date: Date;
			end_date: Date;
			cancellation_date?: Date;
			city?: string;
			state?: string;
			rental_rate?: number;
			closing_date?: Date;
		} = {
			status,
			cep,
			start_date,
			end_date,
			cancellation_date,
			closing_date,
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
