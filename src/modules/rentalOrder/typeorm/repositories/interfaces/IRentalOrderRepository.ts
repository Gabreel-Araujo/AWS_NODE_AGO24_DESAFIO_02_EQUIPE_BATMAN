import { UpdateResult } from 'typeorm';
import {
	ICreateRentalOrder,
} from '../../entities/interfaces/RentalOrderInterface';
import RentalOrder from '../../entities/RentalOrder';

export interface IRentalOrderRepository {
	findByCustomer(customer_id: string): Promise<RentalOrder | null>;
	findByCar(car_id: string): Promise<RentalOrder | null>;
	findById(id: string): Promise<RentalOrder | null>;
	save(order: ICreateRentalOrder): Promise<RentalOrder>;
	update(id: string, order: Partial<RentalOrder>): Promise<UpdateResult>;
}
