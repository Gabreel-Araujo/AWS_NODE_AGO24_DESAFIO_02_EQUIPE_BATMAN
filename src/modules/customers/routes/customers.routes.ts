import { Request, Response, Router } from 'express';
import CustomerService from '../services/CustomerService';
import validation from '@/http/middleware/validation';
import {
	getCustomerIdSchema,
	postCustomerSchema,
} from './validators/CustomerValidator';
import { authenticate } from '@/http/middleware/auth';
import { ICreateCustomer } from '../typeorm/entities/interfaces/CustomerInterface';

const customersRouter = Router();

const customersService = new CustomerService();

customersRouter.get('/');

customersRouter.get(
	'/:id',
	validation(getCustomerIdSchema, 'params'),
	authenticate,
	async (req, res) => {
		const { id } = req.params;
		const costumer = await customersService.execute(id);

		res.json(costumer);
	},
);

customersRouter.post(
	'/',
	validation(postCustomerSchema, 'body'),
	authenticate,
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
	async (req, res) => {
		const { id } = req.params;

		const costumer = await customersService.delete(id);

		res.status(204).json(costumer);
	},
);

export default customersRouter;
