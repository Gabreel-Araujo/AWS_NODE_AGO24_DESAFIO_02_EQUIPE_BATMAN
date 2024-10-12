import { Item } from '../../typeorm/entities/Items';
import { ICar } from '../../typeorm/repositories/interfaces/ICarRepository';

export interface ICarService {
	createCar(
		plate: string,
		model: string,
		brand: string,
		km: number,
		daily_price: number,
		year: number,
		items?: Item[],
	): Promise<ICar | null>;
	createCarItems(carId: string, items: Item[]): Promise<void>;
	findById(id: string): Promise<ICar | null>;
}
