import {
	ICreateRentalOrder,
	IRentalOrder,
} from '../../entities/interfaces/RentalOrderInterface';
import RentalOrder from '../../entities/RentalOrder';

export interface IRentalOrderRepository {
	findByCustomer(customer_id: string): Promise<RentalOrder | null>;
	findByCar(car_id: string): Promise<RentalOrder | null>;
	findById(id: string): Promise<RentalOrder | null>;
	findActiveOrdersByCarId(carId: string): Promise<boolean>;
	save(order: ICreateRentalOrder): Promise<RentalOrder>;
	softDeleteById(id: string): Promise<void>;
	findAll(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		filters: any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		pagination: any,
	): Promise<{ data: IRentalOrder[]; total: number }>;
}
