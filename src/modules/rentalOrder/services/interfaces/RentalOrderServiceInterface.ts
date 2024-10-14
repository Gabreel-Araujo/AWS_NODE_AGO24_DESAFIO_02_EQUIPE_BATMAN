import { ICreateRentalOrder } from '../../typeorm/entities/interfaces/RentalOrderInterface';
import RentalOrder from '../../typeorm/entities/RentalOrder';

export interface IRentalOrderService {
	create(customer: ICreateRentalOrder): Promise<RentalOrder>;
}
