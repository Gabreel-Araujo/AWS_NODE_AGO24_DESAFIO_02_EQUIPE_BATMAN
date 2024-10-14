import {
	ICreateRentalOrder,
	IRentalOrder,
} from '../../entities/interfaces/RentalOrderInterface';
import RentalOrder from '../../entities/RentalOrder';

export interface IRentalOrderRepository {
	findOrderStatusByCustomer(customer_id: string): Promise<RentalOrder | null>;
	findOrderStatusByCar(car_id: string): Promise<RentalOrder | null>;
	findById(id: string): Promise<RentalOrder | null>;
	save(order: ICreateRentalOrder): Promise<RentalOrder>;
	softDeleteById(id: string): Promise<void>;
}
