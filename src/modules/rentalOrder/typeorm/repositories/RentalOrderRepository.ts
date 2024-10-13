import { dbConnection } from '@/lib/typeorm';
import { Repository } from 'typeorm';
import { ICreateRentalOrder, IRentalOrder } from '../entities/interfaces/RentalOrderInterface';
import RentalOrder from '../entities/RentalOrder';
import { IRentalOrderRepository } from './interfaces/IRentalOrderRepository';

class RentalOrderRepository implements IRentalOrderRepository {
	private ormRepository: Repository<RentalOrder>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(RentalOrder);
	}

	public async save(order: ICreateRentalOrder): Promise<IRentalOrder> {
        const rentalOrder = this.ormRepository.create(order);
        await this.ormRepository.save(rentalOrder);
        return rentalOrder;
    }    
}

export default RentalOrderRepository;
