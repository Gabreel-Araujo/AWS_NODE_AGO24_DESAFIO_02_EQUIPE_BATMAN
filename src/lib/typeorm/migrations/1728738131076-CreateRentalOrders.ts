import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRentalOrders1728738131076 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'rental_orders',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'customer_id',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'order_date',
						type: 'timestamp',
						default: 'now()',
					},
					{
						name: 'status',
						type: 'enum',
						enum: ['open', 'aproved', 'closed', 'canceled'],
						default: "'open'",
					},
					{
						name: 'cep',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'city',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'state',
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
						isNullable: true,
					},
					{
						name: 'rental_rate',
						type: 'decimal',
						default: 0,
					},
					{
						name: 'total',
						type: 'decimal',
						default: 0,
					},
					{
						name: 'car_id',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'start_date',
						type: 'timestamp',
						default: null,
						isNullable: true,
					},
					{
						name: 'end_date',
						type: 'timestamp',
						default: null,
						isNullable: true,
					},
					{
						name: 'cancellation_date',
						type: 'timestamp',
						isNullable: true,
					},
					{
						name: 'closing_date',
						type: 'timestamp',
						isNullable: true,
					},
					{
						name: 'late_fee',
						type: 'decimal',
						isNullable: true,
					},
				],
				foreignKeys: [
					{
						name: 'FK_Customer_Id',
						referencedTableName: 'customers',
						referencedColumnNames: ['id'],
						columnNames: ['customer_id'],
					},
					{
						name: 'FK_Car_Id',
						referencedTableName: 'cars',
						referencedColumnNames: ['id'],
						columnNames: ['car_id'],
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('rental_orders');
	}
}
