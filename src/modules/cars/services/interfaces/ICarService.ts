import { Item } from '../../typeorm/entities/Items';
import { ICar } from '../../typeorm/repositories/interfaces/ICarRepository';

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
}
