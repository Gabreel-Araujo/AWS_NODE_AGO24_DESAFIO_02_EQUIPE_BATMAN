import { Repository } from 'typeorm';
import { Cars } from '../entities/Car';
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
}
