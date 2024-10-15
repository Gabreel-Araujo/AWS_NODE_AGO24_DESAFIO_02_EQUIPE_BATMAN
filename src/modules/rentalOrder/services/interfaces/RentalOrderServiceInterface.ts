import { UpdateResult } from 'typeorm';
import RentalOrder from '../../typeorm/entities/RentalOrder';
import { ICreateRentalOrder } from '../../typeorm/entities/interfaces/RentalOrderInterface';

export interface IRentalOrderService {
	softDeleteById(id: string): Promise<void>;
	create(customer: ICreateRentalOrder): Promise<RentalOrder>;
	findById(id: string): Promise<RentalOrder>;
	update(
		id: string,
		order: Partial<RentalOrder>,
	): Promise<UpdateResult | undefined>;
}
