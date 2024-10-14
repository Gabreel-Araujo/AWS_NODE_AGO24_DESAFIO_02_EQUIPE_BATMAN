import {
	ICar,
	ISearchParams,
} from '../../typeorm/repositories/interfaces/ICarRepository';
import { Item } from '../../typeorm/entities/Items';

export interface ICarService {
	createCar(
		plate: string,
		brand: string,
		model: string,
		year: number,
		daily_price: number,
		km: number,
		items?: Item[],
	): Promise<ICar | null>;
	createCarItems(car: ICar, items: Item[]): Promise<void>;
	findById(id: string): Promise<ICar | null>;
	findAll({ limit, page, searchParams }: ICarPagination): Promise<{
		cars: ICar[];
		count: number;
		total_pages: number;
		current_page: number;
	}>;
}

export interface ICarPagination {
	limit: number;
	page: number;
	searchParams?: ISearchParams;
}
