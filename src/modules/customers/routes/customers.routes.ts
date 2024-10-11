import { Request, Response, Router } from 'express';
import CustomerService from '../services/CustomerService';
import { z } from 'zod';
import { SearchParamsInterface } from '../services/interfaces/SearchParamsInterface';
import validation from '@/http/middleware/validation';
import {
	getCustomerIdSchema,
	postCustomerSchema,
} from './validators/CustomerValidator';
import { authenticate } from '@/http/middleware/auth';
import { ICreateCustomer } from '../typeorm/entities/interfaces/CustomerInterface';

const customersRouter = Router();

const customersService = new CustomerService();

customersRouter.use(authenticate);

customersRouter.get('/', async (req: Request, res: Response) => {
	const page = req.query.page ? Number(req.query.page) : 1;
	const limit = req.query.limit ? Number(req.query.limit) : 10;

	const valuesParams: SearchParamsInterface = { page, limit };
	const { orderBy, name, cpf, email, deleted } = req.query;

	if (orderBy &&(orderBy === 'name' ||orderBy === 'createdAt' ||orderBy === 'deletedAt'))valuesParams.orderBy = orderBy.toString();


	if (name) valuesParams.name = name.toString();
	if (cpf) valuesParams.cpf = cpf.toString();
	if (email) valuesParams.email = email.toString();
	if (deleted && (deleted === 'true' || deleted === 'false'))
		valuesParams.deleted = deleted;

	const listCustomers = await customersService.listAll(valuesParams);
	return res.json(listCustomers);
});

customersRouter.get(
	'/:id',
	validation(getCustomerIdSchema, 'params'),
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const costumer = await customersService.execute(id);

		res.json(costumer);
	},
);

customersRouter.post(
	'/',
	validation(postCustomerSchema, 'body'),
	async (req: Request, res: Response) => {
		const { name, birth, cpf, email, phone_number } = req.body;

		const customer: ICreateCustomer = { name, birth, cpf, email, phone_number };

		const createdCustomer = await customersService.save(customer);

		res.status(201).json({ id: createdCustomer.id });
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
