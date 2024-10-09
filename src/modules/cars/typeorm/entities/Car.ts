import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from './Items';

@Entity('cars')
export class Cars {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column('varchar')
	plate!: string;

	@Column('varchar')
	brand!: string;

	@Column('varchar')
	model!: string;

	@Column('decimal')
	km!: number;

	@Column('int')
	year!: number;

	@Column({
		type: 'enum',
		enum: ['ativo', 'inativo', 'excluído'],
		default: 'ativo',
	})
	status!: string;

	@Column('timestamp')
	created_at!: Date;

	@Column('timestamp')
	updated_at!: Date;

	@OneToMany(
		() => Item,
		(item) => item.car,
	)
	items!: Item[];
}
