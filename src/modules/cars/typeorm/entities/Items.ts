import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cars } from './Car';

@Entity('items')
export class Item {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'uuid' })
	car_id!: string;

	@Column({ type: 'varchar' })
	item!: string;

	@ManyToOne(
		() => Cars,
		(car) => car.items,
	)
	@JoinColumn({ name: 'car_id' })
	car!: Cars;
}
