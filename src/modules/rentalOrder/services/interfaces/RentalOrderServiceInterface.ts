import { ICreateRentalOrder } from '../../typeorm/entities/interfaces/RentalOrderInterface';
import RentalOrder from '../../typeorm/entities/RentalOrder';

export interface IRentalOrderService {
	softDeleteById(id: string): Promise<void>;
	create(customer: ICreateRentalOrder): Promise<RentalOrder>;
	findById(id: string): Promise<RentalOrder>;
}
