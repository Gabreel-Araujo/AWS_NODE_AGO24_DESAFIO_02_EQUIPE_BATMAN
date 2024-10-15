import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import Car from '../../../cars/typeorm/entities/Car';
import Customer from '../../../customers/typeorm/entities/Customer';

@Entity('rental_orders')
class RentalOrder {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(
		() => Customer,
		(customer) => customer,
	)
	@JoinColumn({ name: 'customer_id' })
	customer: Customer;

	@Column('uuid')
	customer_id: string;

	@CreateDateColumn()
	order_date: Date;

	@Column({
		type: 'enum',
		enum: ['open', 'aproved', 'closed', 'canceled'],
		default: 'open',
	})
	status: string;

	@Column('varchar', { nullable: true })
	cep: string;

	@Column('varchar', { nullable: true })
	city: string;

	@Column({
		type: 'varchar',
		enum: [
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
		],
		default: null,
	})
	state: string;

	@Column('decimal')
	rental_rate: number;

	@Column('decimal')
	total: number;

	@ManyToOne(
		() => Car,
		(car) => car,
	)
	@JoinColumn({ name: 'car_id' })
	car: Car;

	@Column('uuid')
	car_id: string;

	@CreateDateColumn({ nullable: true })
	start_date: Date;

	@CreateDateColumn({ nullable: true })
	end_date: Date;

	@CreateDateColumn({ nullable: true })
	cancellation_date: Date;

	@CreateDateColumn({ nullable: true })
	closing_date: Date;

	@Column('decimal', { nullable: true })
	late_fee: number;
}

export default RentalOrder;
