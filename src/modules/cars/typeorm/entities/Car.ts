import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Item } from './Items';
import RentalOrder from '../../../rentalOrder/typeorm/entities/RentalOrder';


export enum CarStatus {
	ACTIVE = 'ativo',
	INACTIVE = 'inativo',
	ERASED = 'excluído',
}
@Entity('cars')
export default class Cars {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', length: 7, unique: true })
	plate!: string;

	@Column('varchar')
	brand!: string;

	@Column('varchar')
	model!: string;

	@Column('int')
	year!: number;

	@Column('float', { nullable: false })
	daily_price!: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	km!: number;

	@Column({
		type: 'enum',
		enum: CarStatus,
		default: CarStatus.ACTIVE,
	})
	status!: CarStatus;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	@OneToMany(
		() => Item,
		(item) => item.car,
	)
	items!: Item[];

	@OneToMany(
		() => RentalOrder,
		(rentalOrder) => rentalOrder.car,
	)
	rentalOrders: RentalOrder[];
}
