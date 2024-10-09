import { MigrationInterface, QueryRunner, Table } from "typeorm";

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
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'cpf',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'email',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'number',
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
					},
				],
			}),
		);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('customers');
    }

}
