import { ICarService } from './interfaces/ICarService';
import {
	ICar,
	ICarRepository,
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
}

export default CarService;
