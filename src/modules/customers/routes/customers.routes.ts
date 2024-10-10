import { Router } from 'express';
import CustomerService from '../services/CustomerService';
import { z } from 'zod';


const customersRouter = Router();

const customersService = new CustomerService();

customersRouter.get('/', async (req, res) => {
	const page = req.query.page ? Number(req.query.page) : 1
	const limit = req.query.limit ? Number(req.query.limit) : 10

	const listCustomers = await customersService.listAll({ page, limit})
	return res.json(listCustomers)
});

customersRouter.get('/:id', async (req, res) => {
	const idSchema = z.string().uuid();

	const id = idSchema.parse(req.params.id);
	const costumer = await customersService.execute(id);

	res.json(costumer);
});

customersRouter.post('/');
customersRouter.put('/:id');

customersRouter.delete('/:id', async (req, res) => {
	const idSchema = z.string().uuid();
	const id = idSchema.parse(req.params.id);
	const costumer = await customersService.delete(id);
	res.status(204).json(costumer);
});

export default customersRouter;
