export interface SearchParamsInterface {
	page: number;
	limit: number;
	name?: string;
	email?: string;
	cpf?: string;
	deleted?: 'true' | 'false';
	orderBy?: string[] | null;
	order?: 'ASC' | 'DESC' | null;
}
