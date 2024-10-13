export interface IRentalOrder {
	id: string;
	customer_id: string;
	order_date?: Date;
    status?: 'open' | 'aproved' | 'closed' | 'canceled'
	cep?: string | null ;
	city?: string | null;
	state?:
		| 'AC'
		| 'AL'
		| 'AP'
		| 'AM'
		| 'BA'
		| 'CE'
		| 'DF'
		| 'ES'
		| 'GO'
		| 'MA'
		| 'MT'
		| 'MS'
		| 'MG'
		| 'PA'
		| 'PB'
		| 'PR'
		| 'PE'
		| 'PI'
		| 'RJ'
		| 'RN'
		| 'RS'
		| 'RO'
		| 'RR'
		| 'SC'
		| 'SP'
		| 'SE'
		| 'TO'
        | null;
	rental_rate?: number;
    total?: number;
    car_id: string;
	start_date?: Date;
	end_date?: Date | null;
    cancellation_date?: Date | null;
    closing_date?: Date | null;
	late_fee?: number | null;
}

export interface ICreateRentalOrder {
	car_id: string;
	customer_id: string;
}
