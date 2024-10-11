import { Repository } from 'typeorm';
import { Cars, CarStatus } from '../entities/Car';
import { dbConnection } from '@/lib/typeorm';
import { ICar, ICarRepository } from './interfaces/ICarRepository';

export class CarsRepository implements ICarRepository {
	private ormRepository: Repository<Cars>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(Cars);
	}

	async findById(id: string): Promise<ICar | null> {
		const car = await this.ormRepository.findOne({
			where: {
				id,
			},
		});
		if (!car) {
			return null;
		}

		return car;
	}

	async findByPlateAndStatus(
		plate: string,
		status: CarStatus,
	): Promise<ICar | null> {
		const carExists = await this.ormRepository.findOne({
			where: {
				plate,
				status,
			},
		});
		if (!carExists) {
			return null;
		}
		return carExists;
	}

	async createCar(car: ICar): Promise<ICar | null> {
		const newCar = await this.ormRepository.create(car);
		await this.ormRepository.save(newCar);

		return newCar;
	}
}
