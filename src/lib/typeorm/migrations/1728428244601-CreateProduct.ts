import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class CreateProduct1728428244601 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
		await queryRunner.createTable(
			new Table({
				name: 'cars',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'plate',
						type: 'varchar',
						length: '7',
						isUnique: true,
					},
					{
						name: 'brand',
						type: 'varchar',
					},
					{
						name: 'model',
						type: 'varchar',
					},
					{
						name: 'km',
						type: 'decimal',
						precision: 10,
						scale: 2,
						default: 0,
					},
					{
						name: 'year',
						type: 'varchar',
					},
					{
						name: 'status',
						type: 'enum',
						enum: ['ativo', 'inativo', 'excluído'],
						default: "'ativo'",
					},
					{
						name: 'created_at',
						type: 'timestamp with time zone',
						default: 'now()',
					},
					{
						name: 'updated_at',
						type: 'timestamp with time zone',
						default: 'now()',
					},
				],
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: 'items',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'car_id',
						type: 'uuid',
					},
					{
						name: 'item',
						type: 'varchar',
					},
				],
				foreignKeys: [
					{
						name: 'Car_Items',
						referencedTableName: 'cars',
						referencedColumnNames: ['id'],
						columnNames: ['car_id'],
						onDelete: 'CASCADE',
						onUpdate: 'CASCADE',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('cars');
		await queryRunner.dropTable('items');
	}
}
