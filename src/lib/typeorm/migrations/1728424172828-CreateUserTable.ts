import {
	type MigrationInterface,
	type QueryRunner,
	Table,
	TableUnique,
} from 'typeorm';

export class CreateUserTable1728424172828 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'fullName',
						type: 'varchar',
						length: '255',
						isNullable: false,
					},
					{
						name: 'email',
						type: 'varchar',
						length: '255',
						isUnique: true,
						isNullable: false,
					},
					{
						name: 'password',
						type: 'varchar',
						length: '255',
						isNullable: false,
					},
					{
						name: 'createdAt',
						type: 'datetime',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'deletedAt',
						type: 'datetime',
						isNullable: true,
					},
				],
			}),
		);

		await queryRunner.createUniqueConstraint(
			'users',
			new TableUnique({
				name: 'UQ_email',
				columnNames: ['email'],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropUniqueConstraint('users', 'UQ_email');
		await queryRunner.dropTable('users');
	}
}
