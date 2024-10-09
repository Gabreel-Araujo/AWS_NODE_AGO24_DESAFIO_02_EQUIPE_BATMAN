import { Repository } from 'typeorm';
import Customer from '../entities/Customer';
import { dbConnection } from '@/lib/typeorm';

interface ICustomersRepository {
 findById(id:string): Promise<Customer | null>;
}

class CustomersRepository implements ICustomersRepository {
    private ormRepository: Repository<Customer>
    constructor(){
        this.ormRepository = dbConnection.getRepository(Customer)
    }

    public async findById(id: string): Promise<Customer | null> {
        const customer = await this.ormRepository.findOneBy({
            id
        })
        return customer;
    }
}

export default CustomersRepository;