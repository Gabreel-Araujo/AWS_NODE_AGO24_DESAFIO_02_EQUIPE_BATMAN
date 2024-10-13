import { ICreateRentalOrder, IRentalOrder } from "../../typeorm/entities/interfaces/RentalOrderInterface";

export interface IRentalOrderService {
	save(customer: ICreateRentalOrder): Promise<IRentalOrder>;
}
