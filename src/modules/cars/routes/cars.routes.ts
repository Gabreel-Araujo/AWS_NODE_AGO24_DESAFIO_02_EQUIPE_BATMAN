import { authenticate } from '@/http/middleware/auth';
import validation from '@/http/middleware/validation';
import { Request, Response, Router } from 'express';
import CarService from '../services/CarService';
import { CarStatus } from '../typeorm/entities/Car';
import {
	ISearchParams,
	IUpdateCar,
} from '../typeorm/repositories/interfaces/ICarRepository';
import {
	idCarSchema,
	postCarSchema,
	putCarSchema,
} from './validators/CarValidator';

const carsRouter = Router();

const carService = new CarService();

carsRouter.use(authenticate);

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

carsRouter.get('/', async (req: Request, res: Response) => {
	const page = req.query.page ? Number(req.query.page) : 1;
	const limit = req.query.limit ? Number(req.query.limit) : 10;

	const searchParams: ISearchParams = {};

	const {
		status,
		plate,
		brand,
		model,
		km,
		fromYear,
		untilYear,
		sortBy,
		order,
		minDailyPrice,
		maxDailyPrice,
	} = req.query;

	if (status) {
		switch (status) {
			case CarStatus.ACTIVE:
				searchParams.status = status;
				break;
			case CarStatus.INACTIVE:
				searchParams.status = status;
				break;
			case CarStatus.ERASED:
				searchParams.status = status;
				break;
			default:
				res.status(204).send();
				break;
		}
	}

	if (plate) searchParams.plate = plate.toString();
	if (brand) searchParams.brand = brand.toString();
	if (model) searchParams.model = model.toString();
	if (km && !Number.isNaN(Number(km))) searchParams.km = Number(km);
	if (fromYear) searchParams.fromYear = Number(fromYear);
	if (untilYear) searchParams.untilYear = Number(untilYear);
	if (minDailyPrice) searchParams.minDailyPrice = Number(minDailyPrice);
	if (maxDailyPrice) searchParams.maxDailyPrice = Number(maxDailyPrice);

	if (sortBy) {
		let fieldsToSort = sortBy.toString().split(',');
		fieldsToSort = fieldsToSort.filter(
			(field) => field === 'km' || field === 'year' || field === 'daily_price',
		);

		searchParams.sortBy = fieldsToSort as ('km' | 'year' | 'daily_price')[];
	}

	if (order) searchParams.order = order.toString();

	const { cars, count, total_pages, current_page } = await carService.findAll({
		limit,
		page,
		searchParams,
	});

	if (count === 0) {
		res.status(204).send();
	}

	res.status(200).json({ count, total_pages, current_page, cars });
});

carsRouter.get('/:id', validation(idCarSchema, 'params'), async (req, res) => {
	const { id } = req.params;
	const car = await carService.findById(id);

	res.status(200).json(car);
});

carsRouter.delete(
	'/:id',
	validation(idCarSchema, 'params'),
	async (req, res) => {
		const { id } = req.params;
		await carService.softDeleteCar(id);

		res.status(204).send();
	},
);

carsRouter.put('/:id', validation(putCarSchema, 'body'), async (req, res) => {
	const { id } = req.params;
	const { km, daily_price, status, plate, items } = req.body;

	const car: IUpdateCar = { km, daily_price, status, plate, items };

	const updatedCar = await carService.updateCar(id, car, items as string[]);

	res.status(200).send(updatedCar);
});

export default carsRouter;
