export interface SearchParamsInterface {
	page: number;
	limit: number;
	name?: string;
	email?: string;
	cpf?: string;
	deleted?: 'true' | 'false';
}
