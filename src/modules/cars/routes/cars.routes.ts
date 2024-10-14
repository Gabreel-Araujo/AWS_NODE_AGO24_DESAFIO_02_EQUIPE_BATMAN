import { Router } from 'express';
import CarService from '../services/CarService';
import { authenticate } from '@/http/middleware/auth';
import validation from '@/http/middleware/validation';
import { idCarSchema, postCarSchema } from './validators/CarValidator';

const carsRouter = Router();

const carService = new CarService();

carsRouter.use(authenticate);

carsRouter.get('/:id', validation(idCarSchema, 'params'), async (req, res) => {
	const { id } = req.params;
	const car = await carService.findById(id);

	res.status(200).json(car);
});

carsRouter.post('/', validation(postCarSchema, 'body'), async (req, res) => {
	const { plate, brand, model, year, daily_price, km, items } = req.body;

	const car = await carService.createCar(
		plate,
		brand,
		model,
		Number(year),
		Number(daily_price),
		Number(km),
		items,
	);

	res.status(200).json({ id: car?.id });
});

export default carsRouter;
