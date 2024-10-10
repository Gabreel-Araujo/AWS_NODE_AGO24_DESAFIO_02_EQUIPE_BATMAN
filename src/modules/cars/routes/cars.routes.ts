import { Router } from 'express';
import CarService from '../services/CarService';
import { authenticate } from '@/http/middleware/auth';
import validation from '@/http/middleware/validation';
import { idCarSchema } from './validators/carValidator';

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

export default carsRouter;
