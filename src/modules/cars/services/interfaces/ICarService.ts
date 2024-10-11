import {
	ICar,
	ISearchParams,
} from '../../typeorm/repositories/interfaces/ICarRepository';

export interface ICarService {
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
