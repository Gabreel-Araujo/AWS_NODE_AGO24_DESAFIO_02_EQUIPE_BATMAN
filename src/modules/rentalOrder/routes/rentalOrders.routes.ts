import { Request, Response, Router } from 'express';
import validation from '@/http/middleware/validation';
import { authenticate } from '@/http/middleware/auth';
import { ICreateRentalOrder } from '../typeorm/entities/interfaces/RentalOrderInterface';
import RentalOrderService from '../services/RentalOrderService';
import {
	postOrderSchema,
	queryParamsSchema,
} from './validators/RentalOrdersValidators';

const ordersRouter = Router();

const ordersService = new RentalOrderService();
const rentalOrderService = new RentalOrderService();

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

ordersRouter.delete('/:id', async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await ordersService.deleteById(id);
		res.status(204).send();
	} catch (error) {
		console.log(error);
		res.status(404).json({ error: error });
	}
});
ordersRouter.get('/', validation(queryParamsSchema), async (req, res) => {
	try {
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
			size: Number.parseInt(req.query.size as string) || 10,
		};

		const { data, total } = await rentalOrderService.getAllOrders(
			filters,
			pagination,
		);

		res.status(200).json({
			total,
			currentPage: pagination.page,
			totalPages: Math.ceil(total / pagination.size),
			data,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error });
	}
});
//ordersRouter.put('/:id');

//ordersRouter.delete('/:id',);

export default ordersRouter;
