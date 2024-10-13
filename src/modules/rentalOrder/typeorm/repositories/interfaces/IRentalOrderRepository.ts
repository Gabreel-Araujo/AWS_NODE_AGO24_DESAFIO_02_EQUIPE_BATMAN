import { ICreateRentalOrder, IRentalOrder } from "../../entities/interfaces/RentalOrderInterface";

export interface IRentalOrderRepository {
	save(order: ICreateRentalOrder): Promise<IRentalOrder>;
}
