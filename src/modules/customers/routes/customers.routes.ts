import { Router } from 'express';
import CustomerService from '../services/CustomerService';
import validation from '@/http/middleware/validation';
import { getCustomerIdSchema } from './validators/CustomerValidator';
import { authenticate } from '@/http/middleware/auth';

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

customersRouter.post('/');
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
