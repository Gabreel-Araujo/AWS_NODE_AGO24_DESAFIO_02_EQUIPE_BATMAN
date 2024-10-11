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
	createCar(newCar: ICar): Promise<ICar | null>;
	findById(id: string): Promise<ICar | null>;
	findByPlateAndStatus(plate: string, status: CarStatus): Promise<ICar | null>;
}
