import { CarStatus } from '../../entities/Car';
import { Item } from '../../entities/Items';

export interface ICar {
	id: string;
	plate: string;
	brand: string;
	model: string;
	km: number;
	year: number;
	status: CarStatus;
	created_at: Date;
	updated_at: Date;
	items: Item[];
}

export interface ICarRepository {
	findById(id: string): Promise<ICar | null>;
	findAll(
		skip: number,
		take: number,
		searchParams?: ISearchParams,
	): Promise<[ICar[], number]>;
}

export type ISearchParams = {
	status?: CarStatus | undefined;
	plate?: string | undefined;
	brand?: string | undefined;
	model?: string | undefined;
	km?: number | undefined;
	fromYear?: number | undefined;
	untilYear?: number | undefined;
	sortBy?: ('km' | 'year')[] | undefined;
	order?: string | undefined;
};
