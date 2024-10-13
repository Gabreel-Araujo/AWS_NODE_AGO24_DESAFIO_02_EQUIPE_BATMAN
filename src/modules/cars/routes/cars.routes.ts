import { Router } from 'express';
import CarService from '../services/CarService';
import { authenticate } from '@/http/middleware/auth';
import validation from '@/http/middleware/validation';
import { idCarSchema, postCarSchema } from './validators/CarValidator';

const carsRouter = Router();

const carService = new CarService();

carsRouter.get(
	'/:id',
	validation(idCarSchema, 'params'),
	authenticate,
	(req, res) => {
		const { id } = req.params;
		const car = carService.findById(id);

		res.status(200).json(car);
	},
);

carsRouter.post(
	'/',
	validation(postCarSchema, 'body'),
	authenticate,
	(req, res) => {
		const { plate, brand, model, year, daily_price, km, items } = req.body;
		console.log(req.body);
		const createdCar = carService.createCar(
			plate,
			brand,
			model,
			Number(year),
			Number(daily_price),
			Number(km),
			items,
		);

		res.status(200).json(createdCar);
	},
);

export default carsRouter;
