export interface SearchParamsInterface {
	page: number;
	limit: number;
	orderBy?: string;
	name?: string;
	email?: string;
	cpf?: string;
	deleted?: 'true' | 'false';
}
