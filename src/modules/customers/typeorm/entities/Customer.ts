import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('customers')
class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('varchar', {nullable: false})
    name: string;

    @Column('date', {nullable: false})
    birth: Date;

    @Column('varchar', {nullable: false})
    cpf: string;

    @Column('varchar', {nullable: false})
    email: string;

    @Column('varchar', {nullable: false})
    number: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

}

export default Customer;