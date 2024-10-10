import { Router } from 'express';
import CustomerService from '../services/CustomerService';
import validation from '@/http/middleware/validation';
import { getUserSchema } from './validators/CustomerValidator';
import { authenticate } from '@/http/middleware/auth';

const customersRouter = Router();

const customersService = new CustomerService();

customersRouter.get('/');

customersRouter.get(
	'/:id',
	validation(getUserSchema, 'params'),
	authenticate,
	async (req, res) => {
		const { id } = req.params;
		const costumer = await customersService.execute(id);

		res.json(costumer);
	},
);

customersRouter.post('/');
customersRouter.put('/:id');
customersRouter.delete('/:id');

export default customersRouter;
