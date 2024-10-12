import Customer from '../../../customers/typeorm/entities/Customer';
import Car from '../../../cars/typeorm/entities/Car';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('rental_orders')
class RentalOrder {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(
		() => Customer,
		(customer) => customer,
	)
	@JoinColumn({ name: 'customer_id' })
	customer_id: Customer;

	@CreateDateColumn()
	order_date: Date;

	@Column({
		type: 'enum',
		enum: ['open', 'aproved', 'closed', 'canceled'],
		default: 'open',
	})
	status: string;

	@Column('varchar', { nullable: false})
	cep: string;

	@Column('varchar', { nullable: false})
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
	car_id: Car;

  @CreateDateColumn()
	start_date: Date;

  @CreateDateColumn()
	end_date: Date;

  @CreateDateColumn({ nullable: true })
	cancellation_date: Date;

	@CreateDateColumn({ nullable: true })
	closing_date: Date;

	@Column('decimal', { nullable: true })
	late_fee: number;
	customer: Customer;
	car: Car;
}

export default RentalOrder;
