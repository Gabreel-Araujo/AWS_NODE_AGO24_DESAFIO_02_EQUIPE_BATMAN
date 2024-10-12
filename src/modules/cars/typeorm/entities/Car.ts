import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Item } from './Items';

export enum CarStatus {
	ACTIVE = 'ativo',
	INACTIVE = 'inativo',
	ERASED = 'excluído',
}
@Entity('cars')
export class Cars {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', length: 7, unique: true })
	plate!: string;

	@Column('varchar')
	model!: string;

	@Column('varchar')
	brand!: string;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	km!: number;

	@Column('float', { nullable: false })
	daily_price!: number;

	@Column('int')
	year!: number;

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
}
