import Cars, { CarStatus } from '../entities/Car';
import {
	FindOptionsOrder,
	FindOptionsWhere,
	Repository,
	UpdateResult,
} from 'typeorm';
import { Item } from '../entities/Items';
import { dbConnection } from '@/lib/typeorm';
import { ICar, ICarRepository, IUpdateCar } from './interfaces/ICarRepository';
import NotFoundError from '@/http/errors/not-found-error';

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
			relations: ['items'],
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

	async updateCar(
		id: string,
		{ daily_price, km, plate, status }: IUpdateCar,
		items: string[],
	): Promise<ICar | null> {
		const existingCar = await this.ormRepository.findOne({
			where: {
				id,
			},
		});

		if (!existingCar) {
			return null;
		}

		await this.ormRepository.update(id, { daily_price, km, plate, status });

		if (items !== undefined) {
			await this.itemRepository.delete({ car: existingCar });

			const updatedItems = items.map((item) => {
				return this.itemRepository.create({
					item: item,
					car: existingCar,
				});
			});

			await this.itemRepository.save(updatedItems);
		}

		return await this.ormRepository.findOne({
			where: {
				id,
			},
			relations: ['items'],
		});
	}
}
