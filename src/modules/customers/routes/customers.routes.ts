import { Request, Response, Router } from 'express';
import CustomerService from '../services/CustomerService';
import { SearchParamsInterface } from '../services/interfaces/SearchParamsInterface';
import validation from '@/http/middleware/validation';
import {
	getCustomerIdSchema,
	patchCustomerBodySchema,
	patchCustomerParamsSchema,
	getCustomerQuerySchema,
	postCustomerSchema,
} from './validators/CustomerValidator';
import { authenticate } from '@/http/middleware/auth';
import {
	ICreateCustomer,
	IUpdateCustomer,
} from '../typeorm/entities/interfaces/CustomerInterface';

const customersRouter = Router();

const customersService = new CustomerService();

customersRouter.use(authenticate);

customersRouter.get(
	'/',
	validation(getCustomerQuerySchema, 'query'),
	async (req: Request, res: Response) => {
		const page = req.query.page ? Number(req.query.page) : 1;
		const limit = req.query.limit ? Number(req.query.limit) : 10;

		const valuesParams: SearchParamsInterface = { page, limit };
		const { order, orderBy, name, cpf, email, deleted } = req.query;

		if (name) valuesParams.name = name.toString().toLowerCase();
		if (email) valuesParams.email = email.toString().toLowerCase();
		if (cpf) valuesParams.cpf = cpf.toString();
		if (deleted && (deleted === 'true' || deleted === 'false'))
			valuesParams.deleted = deleted;
		if (orderBy) valuesParams.orderBy = orderBy.toString();

		if (order && typeof order === 'string') {
			valuesParams.order = order.toUpperCase() as 'ASC' | 'DESC';
		}

		const listCustomers = await customersService.listAll(valuesParams);

		res.status(200).json(listCustomers);
	},
);

customersRouter.get(
	'/:id',
	validation(getCustomerIdSchema, 'params'),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const costumer = await customersService.execute(id);

		res.status(200).json(costumer);
	},
);

customersRouter.post(
	'/',
	authenticate,
	validation(postCustomerSchema, 'body'),
	async (req: Request, res: Response) => {
		const { name, birth, cpf, email, phone_number } = req.body;

		const customer: ICreateCustomer = {
			name,
			birth,
			cpf,
			email,
			phone_number,
		};

		const createdCustomer = await customersService.save(customer);

		res.status(201).json({ id: createdCustomer.id });
	},
);

customersRouter.patch(
	'/:id',
	validation(patchCustomerParamsSchema, 'params'),
	validation(patchCustomerBodySchema, 'body'),
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { name, birth, email, cpf, phone_number } = req.body;

		const customer: IUpdateCustomer = {
			name: name ?? null,
			birth: birth ?? null,
			email: email ?? null,
			cpf: cpf ?? null,
			phone_number: phone_number ?? null,
		};

		await customersService.update(id, customer);

		res.status(204).send();
	},
);

customersRouter.put('/:id');

customersRouter.delete(
	'/:id',
	validation(getCustomerIdSchema, 'params'),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const costumer = await customersService.delete(id);

		res.status(204).json(costumer);
	},
);

export default customersRouter;
