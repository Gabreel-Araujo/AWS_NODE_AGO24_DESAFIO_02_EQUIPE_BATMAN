export interface ICustomer {
	id: string;
	name: string;
	birth: Date;
	cpf: string;
	email: string;
	phone_number: string;
	created_at: Date;
	deleted_at?: Date | null ;
}
