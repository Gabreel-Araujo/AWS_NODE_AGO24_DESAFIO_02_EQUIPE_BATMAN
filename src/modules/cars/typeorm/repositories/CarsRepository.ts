import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { Cars, CarStatus } from '../entities/Car';
import { Item } from '../entities/Items';
import { dbConnection } from '@/lib/typeorm';
import { ICar, ICarRepository } from './interfaces/ICarRepository';

export class CarsRepository implements ICarRepository {
	private ormRepository: Repository<Cars>;
	private itemRepository: Repository<Item>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(Cars);
		this.itemRepository = dbConnection.getRepository(Item);
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

	async findAll(
		skip: number,
		take: number,
		where: FindOptionsWhere<ICar>,
		order: FindOptionsOrder<ICar>,
	) {
		return await this.ormRepository.findAndCount({
			skip,
			take,
			where,
			order,
			relations: ['items'],
		});
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

	async save(car: ICar): Promise<ICar> {
		const newCar = this.ormRepository.create(car);
		const createdCar = await this.ormRepository.save(newCar);

		return createdCar;
	}

	async createCarItems(
		items: { id: string; car: ICar; item: string }[],
	): Promise<void> {
		const newItems = this.itemRepository.create(items);
		await this.itemRepository.save(newItems);
	}
}
