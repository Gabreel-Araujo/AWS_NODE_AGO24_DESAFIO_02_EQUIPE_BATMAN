import { Request, Response, Router } from 'express';
import CustomerService from '../services/CustomerService';
import validation from '@/http/middleware/validation';
import {
	getCustomerSchema,
	postCustomerSchema,
} from './validators/CustomerValidator';
import { authenticate } from '@/http/middleware/auth';
import {
	ICreateCustomer,
	IUpdateCustomer,
} from '../typeorm/entities/interfaces/CustomerInterface';
import ValidationError from '@/http/errors/validation-error';

const customersRouter = Router();

const customersService = new CustomerService();

customersRouter.get('/');

customersRouter.get(
	'/:id',
	validation(getCustomerSchema, 'params'),
	authenticate,
	async (req, res) => {
		const { id } = req.params;
		const costumer = await customersService.execute(id);

		res.json(costumer);
	},
);

customersRouter.post(
	'/',
	authenticate,
	validation(postCustomerSchema, 'body'),
	async (req: Request, res: Response) => {
		const { name, birth, cpf, email, phone_number } = req.body;
		const customer: ICreateCustomer = { name, birth, cpf, email, phone_number };

		const createdCustomer = await customersService.save(customer);
		res.status(201).json({ id: createdCustomer.id });
	},
);

customersRouter.patch('/:id', async (req: Request, res: Response) => {
	const { name, birth, email, cpf, phone_number } = req.body;

	const customer: IUpdateCustomer = {};
	if (name) customer.name = name;
	if (birth) customer.birth = birth;
	if (email) customer.email = email;
	if (cpf) customer.cpf = cpf;
	if (phone_number) customer.phone_number = phone_number;

	const id = req.params.id;

	if (Object.keys(customer).length === 0) {
		throw new ValidationError('one field at least is required for update');
	}

	await customersService.update(id, customer);
	res.status(204).send();
});

customersRouter.delete('/:id');

export default customersRouter;
