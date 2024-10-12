import { Request, Response, Router } from 'express';
import CustomerService from '../services/CustomerService';
import validation from '@/http/middleware/validation';
import {
	getCustomerIdSchema,
	patchCustomerBodySchema,
	patchCustomerParamsSchema,
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

customersRouter.get('/');

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

		const customer: ICreateCustomer = { name, birth, cpf, email, phone_number };

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
