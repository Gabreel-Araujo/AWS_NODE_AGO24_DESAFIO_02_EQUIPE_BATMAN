import Customer from '../../typeorm/entities/Customer';

export interface CustomerPaginationServiceInterface {
	page: number;
	limit: number;
	total: number;
	customers: Customer[];
}
