import { Router } from 'express';
import CustomerService from '../services/CustomerService';
import { z } from 'zod';

const customersRouter = Router();

const customersService = new CustomerService();

customersRouter.get('/');

customersRouter.get('/:id', async (req, res) => {
	const idSchema = z.string().uuid();

	const id = idSchema.parse(req.params.id);
	const costumer = await customersService.execute(id);

	res.json(costumer);
});

customersRouter.post('/');
customersRouter.put('/:id');
customersRouter.delete('/:id');

export default customersRouter;
