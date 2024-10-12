import Customer from '@/modules/customers/typeorm/entities/Customer';
import Car from '@/modules/cars/typeorm/entities/Car'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('rental_orders')
 class RentalOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer)
  @JoinColumn({name: 'customer_id'})
  customer_id: Customer;

  @Column()
  order_date: Date;

  @Column({
    type: 'enum',
    enum: ['open', 'aproved', 'closed', 'canceled'],
    default: 'open'
  })
  status: string;

  @Column()
  cep: string;

  @Column()
  city: string;

  @Column({
    type: 'varchar',
    enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'],
  })
  state: string;

  @Column('decimal')
  rental_rate: number;

  @Column('decimal')
  total: number;

  @ManyToOne(() => Car, car => car)
  car_id: Car;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ nullable: true })
  cancellation_date: Date;

  @Column({ nullable: true })
  closing_date: Date;

  @Column('decimal', { nullable: true })
  late_fee: number;

}

export default RentalOrder;