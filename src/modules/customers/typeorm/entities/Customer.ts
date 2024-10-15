import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import RentalOrder from '../../../rentalOrder/typeorm/entities/RentalOrder';

@Entity('customers')
class Customer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('varchar', { nullable: false })
	name: string;

	@Column('date', { nullable: false })
	birth: Date;

	@Column('varchar', { nullable: false, unique: true })
	cpf: string;

	@Column('varchar', { nullable: false, unique: true })
	email: string;

	@Column('varchar', { nullable: false })
	phone_number: string;

	@CreateDateColumn()
	created_at: Date;

	@DeleteDateColumn({ nullable: true })
	deleted_at: Date | null;

	@OneToMany(
		() => RentalOrder,
		(rentalOrder) => rentalOrder.customer,
	)
	rentalOrders: RentalOrder[];
}

export default Customer;
