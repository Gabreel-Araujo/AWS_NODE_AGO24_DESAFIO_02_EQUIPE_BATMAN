import { ICarPagination, ICarService } from './interfaces/ICarService';
import {
	ICar,
	ICarRepository,
} from '../typeorm/repositories/interfaces/ICarRepository';
import NotFoundError from '@/http/errors/not-found-error';
import { CarsRepository } from '../typeorm/repositories/CarsRepository';
import {
	Between,
	FindOptionsOrder,
	FindOptionsWhere,
	LessThanOrEqual,
	Like,
	MoreThanOrEqual,
} from 'typeorm';

class CarService implements ICarService {
	private repository: ICarRepository;

	constructor() {
		this.repository = new CarsRepository();
	}

	async findById(id: string): Promise<ICar | null> {
		const car = await this.repository.findById(id);

		if (!car) {
			throw new NotFoundError('Car not found');
		}

		return car;
	}

	async findAll({ limit, page, searchParams }: ICarPagination) {
		const where: FindOptionsWhere<ICar> = {};

		const order: FindOptionsOrder<ICar> = {};

		if (searchParams?.status) where.status = searchParams.status;
		if (searchParams?.plate) where.plate = Like(`%${searchParams.plate}`);
		if (searchParams?.brand) where.brand = searchParams.brand;
		if (searchParams?.model) where.model = searchParams.model;
		if (searchParams?.km) where.km = LessThanOrEqual(searchParams.km);

		if (searchParams?.fromYear && searchParams.untilYear)
			where.year = Between(searchParams.fromYear, searchParams.untilYear);

		if (searchParams?.fromYear && !searchParams.untilYear)
			where.year = MoreThanOrEqual(searchParams.fromYear);

		if (!searchParams?.fromYear && searchParams?.untilYear)
			where.year = LessThanOrEqual(searchParams.untilYear);

		if (searchParams?.minDailyPrice && !searchParams.maxDailyPrice) {
			where.daily_price = MoreThanOrEqual(searchParams.minDailyPrice);
		}

		if (!searchParams?.minDailyPrice && searchParams?.maxDailyPrice) {
			where.daily_price = LessThanOrEqual(searchParams.maxDailyPrice);
		}

		if (searchParams?.minDailyPrice && searchParams.maxDailyPrice) {
			where.daily_price = Between(
				searchParams.minDailyPrice,
				searchParams.maxDailyPrice,
			);
		}

		const orderBy =
			searchParams?.order === 'DESC' || searchParams?.order === 'desc'
				? searchParams.order
				: 'ASC';

		if (searchParams?.sortBy?.includes('year')) order.year = orderBy;

		if (searchParams?.sortBy?.includes('km')) order.km = orderBy;

		if (searchParams?.sortBy?.includes('daily_price'))
			order.daily_price = orderBy;

		const [cars, count] = await this.repository.findAll(
			(page - 1) * limit,
			limit,
			where,
			order,
		);

		const total_pages = Math.ceil(count / limit);
		return { cars, count, total_pages, current_page: page };
	}
}

export default CarService;
