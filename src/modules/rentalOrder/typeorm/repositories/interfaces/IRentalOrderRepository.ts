import { UpdateResult } from 'typeorm';
import RentalOrder from '../../entities/RentalOrder';
import {
	ICreateRentalOrder,
	IRentalOrder,
} from '../../entities/interfaces/RentalOrderInterface';

export interface IRentalOrderRepository {
	findOrderStatusByCustomer(customer_id: string): Promise<RentalOrder | null>;
	findOrderStatusByCar(car_id: string): Promise<RentalOrder | null>;
	findById(id: string): Promise<RentalOrder | null>;
	save(order: ICreateRentalOrder): Promise<RentalOrder>;
	softDeleteById(id: string): Promise<void>;
	findAll(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		filters: any,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		pagination: any,
	): Promise<{ data: IRentalOrder[]; total: number }>;
	update(id: string, order: Partial<RentalOrder>): Promise<UpdateResult>;
}
