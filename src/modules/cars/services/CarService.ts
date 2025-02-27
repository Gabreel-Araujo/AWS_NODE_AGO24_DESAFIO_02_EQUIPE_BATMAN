import ConflictError from '@/http/errors/conflict-error';
import NotFoundError from '@/http/errors/not-found-error';
import RentalOrderRepository from '@/modules/rentalOrder/typeorm/repositories/RentalOrderRepository';
import {
	Between,
	FindOptionsOrder,
	FindOptionsWhere,
	LessThanOrEqual,
	Like,
	MoreThanOrEqual,
} from 'typeorm';
import { CarStatus } from '../typeorm/entities/Car';
import { Item } from '../typeorm/entities/Items';
import { CarsRepository } from '../typeorm/repositories/CarsRepository';
import {
	ICar,
	ICarRepository,
	IUpdateCar,
} from '../typeorm/repositories/interfaces/ICarRepository';
import { ICarPagination, ICarService } from './interfaces/ICarService';

class CarService implements ICarService {
	private repository: ICarRepository;
	rentalOrderRepository: RentalOrderRepository;

	constructor() {
		this.repository = new CarsRepository();
		this.rentalOrderRepository = new RentalOrderRepository();
	}

	async createCar(
		plate: string,
		brand: string,
		model: string,
		year: number,
		daily_price: number,
		km: number,
		items: Item[],
	): Promise<ICar | null> {
		const carExists = await this.repository.findByPlateAndStatus(
			plate,
			CarStatus.ACTIVE,
		);

		if (carExists) {
			throw new ConflictError('A car with this plate already exists');
		}

		const newCar: ICar = {
			plate,
			brand,
			model,
			km,
			daily_price,
			year,
			status: CarStatus.ACTIVE,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const createdCar = await this.repository.save(newCar);

		await this.createCarItems(createdCar, items);

		return createdCar;
	}

	async findById(id: string): Promise<ICar | null> {
		const car = await this.repository.findById(id);

		if (!car) {
			throw new NotFoundError('Car not found');
		}

		return car;
	}

	async softDeleteCar(id: string): Promise<ICar | null> {
		const car = await this.findById(id);

		if (!car) {
			throw new NotFoundError('Car not found or already deleted');
		}

		const hasActiveRentalOrder =
			await this.rentalOrderRepository.findActiveOrdersByCarId(id);

		if (hasActiveRentalOrder) {
			throw new ConflictError(
				'Car cannot be deleted, it is in an active or approved rental order',
			);
		}

		const updatedCar = await this.repository.softDeleteCar(id);

		return updatedCar;
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

		if (!cars) {
			throw new NotFoundError('Cars not found');
		}

		const total_pages = Math.ceil(count / limit);
		return { cars, count, total_pages, current_page: page };
	}

	async createCarItems(car: ICar, items: Item[]): Promise<void> {
		const newItems = items.map((item) => {
			const itemName = item;
			return {
				car: car,
				item: itemName,
			};
		});

		await this.repository.createCarItems(newItems);
	}

	async updateCar(
		id: string,
		car: Partial<IUpdateCar>,
		items: string[],
	): Promise<ICar | null> {
		const existingCar = await this.repository.findById(id);

		if (!existingCar || existingCar.status === CarStatus.ERASED) {
			throw new NotFoundError('car not found');
		}

		const updatedCar = await this.repository.updateCar(id, car, items);

		return updatedCar;
	}
}

export default CarService;
