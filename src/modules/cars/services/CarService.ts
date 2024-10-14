import { ICarService } from './interfaces/ICarService';
import {
	ICar,
	ICarRepository,
} from '../typeorm/repositories/interfaces/ICarRepository';
import NotFoundError from '@/http/errors/not-found-error';
import { CarsRepository } from '../typeorm/repositories/CarsRepository';
import RentalOrderRepository from '@/modules/rentalOrder/typeorm/repositories/RentalOrderRepository';

class CarService implements ICarService {
	private repository: ICarRepository;
	rentalOrderRepository: RentalOrderRepository;

	constructor() {
		this.repository = new CarsRepository();
		this.rentalOrderRepository = new RentalOrderRepository();
	}

	async findById(id: string): Promise<ICar | null> {
		const car = await this.repository.findById(id);

		if (!car) {
			throw new NotFoundError('Car not found');
		}
		console.log(car);
		return car;
	}

	async softDeleteCar(id: string): Promise<ICar | null> {
		const car = await this.findById(id);

		if (!car) {
			throw new NotFoundError('Car not found');
		}

		const hasActiveRentalOrder =
			await this.rentalOrderRepository.findActiveOrdersByCarId(id);

		if (hasActiveRentalOrder) {
			throw new Error(
				'Car cannot be deleted, it is in an active or approved rental order',
			);
		}

		// Chama o repositório para soft delete
		const updatedCar = await this.repository.softDeleteCar(id);

		return updatedCar; // Retorna o carro atualizado
	}
}

export default CarService;
