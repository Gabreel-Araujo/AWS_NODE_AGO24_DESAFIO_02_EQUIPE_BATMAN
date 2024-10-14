import { ICar } from '../../typeorm/repositories/interfaces/ICarRepository';

export interface ICarService {
	findById(id: string): Promise<ICar | null>;
	softDeleteCar(id: string): Promise<ICar | null>;
}
