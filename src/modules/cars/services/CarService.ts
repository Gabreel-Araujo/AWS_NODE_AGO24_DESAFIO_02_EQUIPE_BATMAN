import { ICarPagination, ICarService } from './interfaces/ICarService';
import {
	ICar,
	ICarRepository,
	ISearchParams,
} from '../typeorm/repositories/interfaces/ICarRepository';
import NotFoundError from '@/http/errors/not-found-error';
import { CarsRepository } from '../typeorm/repositories/CarsRepository';

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

		const [cars, count] = await this.repository.findAll(
			(page - 1) * limit,
			limit,
			searchParams,
		);

		const total_pages = Math.ceil(count / limit);
		return { cars, count, total_pages, current_page: page };
	}
}

export default CarService;
