import { Repository } from 'typeorm';
import Cars, { CarStatus } from '../entities/Car';
import { dbConnection } from '@/lib/typeorm';
import { ICar, ICarRepository } from './interfaces/ICarRepository';
import NotFoundError from '@/http/errors/not-found-error';

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

	async softDeleteCar(id: string): Promise<ICar | null> {
		const car = await this.findById(id);

		if (!car) {
			throw new NotFoundError('Car not found');
		}
		if (car.status === CarStatus.INACTIVE) {
			throw new Error(
				'Car is already marked as inactive and cannot be deleted again.',
			);
		}

		car.status = CarStatus.INACTIVE;
		car.updated_at = new Date();

		await this.ormRepository.save(car);

		return car;
	}
}
