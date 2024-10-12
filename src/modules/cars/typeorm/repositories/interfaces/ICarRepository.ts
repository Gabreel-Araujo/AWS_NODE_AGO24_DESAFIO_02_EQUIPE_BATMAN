import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CarStatus } from '../../entities/Car';
import { Item } from '../../entities/Items';

export interface ICar {
	id: string;
	plate: string;
	brand: string;
	model: string;
	km: number;
	year: number;
	daily_price: number;
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
		where: FindOptionsWhere<ICar>,
		order: FindOptionsOrder<ICar>,
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
	sortBy?: ('km' | 'year' | 'daily_price')[] | undefined;
	order?: string | undefined;
	minDailyPrice?: number | undefined;
	maxDailyPrice?: number | undefined;
};
