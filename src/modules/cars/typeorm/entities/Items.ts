import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import Cars from './Car';

@Entity('items')
export class Item {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar' })
	item!: string;

	@Column('uuid') 
	car_id!: string;

	@ManyToOne(
		() => Cars,
		(car) => car.items,
		{ onDelete: 'CASCADE' },
	)
	@JoinColumn({ name: 'car_id' })
	car!: Cars;
}
