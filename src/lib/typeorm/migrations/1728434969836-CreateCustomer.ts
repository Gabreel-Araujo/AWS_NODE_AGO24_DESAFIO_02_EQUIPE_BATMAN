import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateCustomer1728434969836 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'customers',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'name',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'birth',
						type: 'date',
						isNullable: false,
					},
					{
						name: 'cpf',
						type: 'varchar',
						isNullable: false,
						isUnique: true,
					},
					{
						name: 'email',
						type: 'varchar',
						isNullable: false,
						isUnique: true,
					},
					{
						name: 'phone_number',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'now()',
					},
					{
						name: 'deleted_at',
						type: 'timestamp',
						isNullable: true,
					},
				],
			}),
		);
		await queryRunner.createUniqueConstraint(
			'customers',
			new TableUnique({
				name: 'UQ_cpf',
				columnNames: ['cpf'],
			}),
		);
		await queryRunner.createUniqueConstraint(
			'customers',
			new TableUnique({
				name: 'UQ_email',
				columnNames: ['email'],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropUniqueConstraints('customers', 'UQ_cpf');
		await queryRunner.dropUniqueConstraints('customers', 'UQ_email');
		await queryRunner.dropTable('customers');
	}
}
