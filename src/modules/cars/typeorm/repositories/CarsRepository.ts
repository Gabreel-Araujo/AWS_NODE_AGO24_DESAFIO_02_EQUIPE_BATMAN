import {
	Between,
	FindOperator,
	LessThanOrEqual,
	MoreThanOrEqual,
	Repository,
} from 'typeorm';
import { Cars, CarStatus } from '../entities/Car';
import { dbConnection } from '@/lib/typeorm';
import {
	ICar,
	ICarRepository,
	ISearchParams,
} from './interfaces/ICarRepository';

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

	async findAll(skip: number, take: number, searchParams: ISearchParams) {
		const where: {
			status?: CarStatus | undefined;
			brand?: string | undefined;
			model?: string | undefined;
			km?: FindOperator<number> | undefined;
			year?: FindOperator<number> | undefined;
		} = {};

		const order = {};

		if (searchParams.status) where.status = searchParams.status;
		if (searchParams.brand) where.brand = searchParams.brand;
		if (searchParams.model) where.model = searchParams.model;
		if (searchParams.km) where.km = LessThanOrEqual(searchParams.km);

		if (searchParams.fromYear && searchParams.untilYear)
			where.year = Between(searchParams.fromYear, searchParams.untilYear);

		if (searchParams.fromYear && !searchParams.untilYear)
			where.year = MoreThanOrEqual(searchParams.fromYear);

		if (!searchParams.fromYear && searchParams.untilYear)
			where.year = LessThanOrEqual(searchParams.untilYear);

		return await this.ormRepository.findAndCount({
			skip,
			take,
			where,
			order,
		});
	}
}
