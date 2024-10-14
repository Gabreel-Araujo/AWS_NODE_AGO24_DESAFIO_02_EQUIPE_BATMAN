import { Router } from 'express';
import CarService from '../services/CarService';
import { authenticate } from '@/http/middleware/auth';
import validation from '@/http/middleware/validation';
import { idCarSchema } from './validators/CarValidator';

const carsRouter = Router();

const carService = new CarService();

carsRouter.get(
	'/:id',
	//validation(idCarSchema, 'params'),
	//authenticate,
	async (req, res) => {
		const { id } = req.params;
		const car = await carService.findById(id);

		res.status(200).json(car);
	},
);
carsRouter.delete(
	'/:id',
	validation(idCarSchema, 'params'),
	authenticate,
	async (req, res) => {
		try {
			const { id } = req.params;
			const deletedCar = await carService.softDeleteCar(id);

			if (!deletedCar) {
				res.status(404).json({ message: 'Car not found or already deleted' });
			} else {
				res.status(200).json({ message: 'Car deleted successfully' });
			}
		} catch (error) {
			console.log(error);
			res
				.status(404)
				.json({ message: 'User has deleted, can not be deleted again' });
		}
	},
);

export default carsRouter;
