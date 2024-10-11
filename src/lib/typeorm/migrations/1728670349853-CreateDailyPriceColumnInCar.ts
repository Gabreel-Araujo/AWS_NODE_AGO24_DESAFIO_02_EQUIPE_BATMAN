import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CreateDailyPriceColumnInCar1728670349853
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'cars',
			new TableColumn({ name: 'daily_price', type: 'float', isNullable: false }),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('cars', 'daily_price');
	}
}
