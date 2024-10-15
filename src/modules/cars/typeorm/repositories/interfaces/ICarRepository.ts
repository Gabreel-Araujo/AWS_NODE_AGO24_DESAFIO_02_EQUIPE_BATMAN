import { FindOptionsOrder, FindOptionsWhere, UpdateResult } from 'typeorm';
import { CarStatus } from '../../entities/Car';
import { Item } from '../../entities/Items';

export interface ICar {
	id?: string;
	plate?: string;
	brand?: string;
	model?: string;
	year?: number;
	daily_price?: number;
	km?: number;
	status?: CarStatus;
	created_at?: Date;
	updated_at?: Date;
	items?: Item[];
}

export interface ICarRepository {
	save(car: ICar): Promise<ICar>;
	createCarItems(items: { car: ICar; item: string | Item }[]): Promise<void>;
	findById(id: string): Promise<ICar | null>;
	softDeleteCar(id: string): Promise<ICar | null>;
	findAll(
		skip: number,
		take: number,
		where: FindOptionsWhere<ICar>,
		order: FindOptionsOrder<ICar>,
	): Promise<[ICar[], number]>;
	findByPlateAndStatus(plate: string, status: CarStatus): Promise<ICar | null>;
	updateCar(id: string, car: IUpdateCar, items: string[]): Promise<ICar | null>;
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

export type IUpdateCar = {
	plate?: string;
	brand?: string;
	model?: string;
	year?: number;
	daily_price?: number;
	km?: number;
	status?: CarStatus;
	items?: string[];
};
