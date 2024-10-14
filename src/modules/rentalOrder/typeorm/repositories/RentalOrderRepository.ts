import { dbConnection } from '@/lib/typeorm';
import { In, Repository } from 'typeorm';
import {
	ICreateRentalOrder,
	IRentalOrder,
} from '../entities/interfaces/RentalOrderInterface';
import RentalOrder from '../entities/RentalOrder';
import { IRentalOrderRepository } from './interfaces/IRentalOrderRepository';

class RentalOrderRepository implements IRentalOrderRepository {
	private ormRepository: Repository<RentalOrder>;

	constructor() {
		this.ormRepository = dbConnection.getRepository(RentalOrder);
	}
	public async findByCustomer(
		customer_id: string,
	): Promise<RentalOrder | null> {
		const customer = await this.ormRepository.findOne({
			where: { customer_id, status: In(['open']) },
		});
		return customer;
	}
	public async findByCar(car_id: string): Promise<RentalOrder | null> {
		const car = await this.ormRepository.findOne({
			where: { car_id, status: In(['open', 'aproved']) },
		});
		return car;
	}
	public async findById(id: string): Promise<RentalOrder | null> {
		const rentalOrder = await this.ormRepository.findOneBy({
			id,
		});
		return rentalOrder;
	}
	public async save(order: ICreateRentalOrder): Promise<RentalOrder> {
		const rentalOrder = this.ormRepository.create(order);
		await this.ormRepository.save(rentalOrder);
		return rentalOrder;
	}

	public async findActiveOrdersByCarId(carId: string): Promise<boolean> {
		const activeOrders = await this.ormRepository.find({
			where: {
				car_id: carId,
				status: In(['open', 'aproved']),
			},
		});
		return activeOrders.length > 0;
	}

	public async softDeleteById(id: string): Promise<void> {
		const rentalOrder = await this.ormRepository.findOneBy({ id });

		if (!rentalOrder) {
			throw new Error('Pedido não encontrado.');
		}

		rentalOrder.status = 'canceled';
		await this.ormRepository.save(rentalOrder);
	}

	async findAll(
		filters: any,
		pagination: { page: number; limit: number },
	): Promise<{ data: IRentalOrder[]; total: number }> {
		const query = this.ormRepository.createQueryBuilder('order');

		if (filters.status) {
			query.andWhere('order.status = :status', { status: filters.status });
		}
		if (filters.customer_cpf) {
			query.leftJoinAndSelect('order.customer', 'customer')
			.andWhere('customer.cpf = :cpf ', {cpf: filters.customer_cpf});
		}

		const total = await query.getCount();

		if (pagination && pagination.page && pagination.limit) {
			const page = Number(pagination.page);
			const limit = Number(pagination.limit);

			if (!isNaN(page) && page > 0 && !isNaN(limit) && limit > 0) {
				query.skip((page - 1) * limit).take(limit);
			}
		}

		const orders = await query.getMany();

		const transformedData: IRentalOrder[] = orders.map((order) => {
			const validStates: Array<IRentalOrder['state']> = [
				'AC',
				'AL',
				'AP',
				'AM',
				'BA',
				'CE',
				'DF',
				'ES',
				'GO',
				'MA',
				'MT',
				'MS',
				'MG',
				'PA',
				'PB',
				'PR',
				'PE',
				'PI',
				'RJ',
				'RN',
				'RS',
				'RO',
				'RR',
				'SC',
				'SP',
				'SE',
				'TO',
				null,
			];

			const state: IRentalOrder['state'] = validStates.includes(
				order.state as IRentalOrder['state'],
			)
				? (order.state as IRentalOrder['state'])
				: null;

			return {
				id: order.id,
				customer_id: order.customer_id,
				order_date: order.order_date || undefined,
				status:
					(order.status as 'open' | 'aproved' | 'closed' | 'canceled') ||
					undefined,
				cep: order.cep || null,
				city: order.city || null,
				state,
				rental_rate: order.rental_rate || undefined,
				total: order.total || undefined,
				car_id: order.car_id,
				start_date: order.start_date || undefined,
				end_date: order.end_date || null,
				cancellation_date: order.cancellation_date || null,
				closing_date: order.closing_date || null,
				late_fee: order.late_fee || null,
			};
		});

		return {
			data: transformedData,
			total,
		};
	}
}

export default RentalOrderRepository;
