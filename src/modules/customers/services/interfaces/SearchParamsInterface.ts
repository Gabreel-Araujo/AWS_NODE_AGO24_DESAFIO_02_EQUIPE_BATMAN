export interface SearchParamsInterface {
	page: number;
	limit: number;
	orderBy?: string;
	order?: 'ASC' | 'DESC' | null
	name?: string;
	email?: string;
	cpf?: string;
	deleted?: 'true' | 'false';
}
