import { UpdateResult } from 'typeorm';
import {
	ICreateRentalOrder,
} from '../../typeorm/entities/interfaces/RentalOrderInterface';
import RentalOrder from '../../typeorm/entities/RentalOrder';

export interface IRentalOrderService {
	save(customer: ICreateRentalOrder): Promise<RentalOrder>;
	update(id: string, order: Partial<RentalOrder>): Promise<UpdateResult | undefined>;
}
