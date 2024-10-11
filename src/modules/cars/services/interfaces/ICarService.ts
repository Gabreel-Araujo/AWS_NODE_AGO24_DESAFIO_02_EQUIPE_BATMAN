import { CarStatus } from '../../typeorm/entities/Car';
import { Item } from '../../typeorm/entities/Items';
import { ICar } from '../../typeorm/repositories/interfaces/ICarRepository';

export interface ICarService {
	createCar(
		plate: string,
		model: string,
		brand: string,
		km: number,
		year: number,
		items: Item[],
	): Promise<ICar | null>;
	findById(id: string): Promise<ICar | null>;
}
