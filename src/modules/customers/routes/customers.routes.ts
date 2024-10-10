import { Request, Response, Router } from 'express';
import CustomerService from '../services/CustomerService';
import { z } from 'zod';
import { SearchParamsInterface } from '../services/interfaces/SearchParamsInterface';

const customersRouter = Router();

const customersService = new CustomerService();

customersRouter.get('/', async (req: Request, res: Response) => {
	const page = req.query.page ? Number(req.query.page) : 1;
	const limit = req.query.limit ? Number(req.query.limit) : 10;

	const valuesParams: SearchParamsInterface = { page, limit };
	const { name, cpf, email, deleted } = req.query;

	if (name) valuesParams.name = name.toString();
	if (cpf) valuesParams.cpf = cpf.toString();
	if (email) valuesParams.email = email.toString();
	if (deleted && (deleted === 'true' || deleted === 'false'))
		valuesParams.deleted = deleted;

	console.log(deleted);
	const listCustomers = await customersService.listAll(valuesParams);
	return res.json(listCustomers);
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
