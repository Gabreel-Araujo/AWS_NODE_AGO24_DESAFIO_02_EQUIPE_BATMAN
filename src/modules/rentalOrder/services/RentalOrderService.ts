import { ICreateRentalOrder, IRentalOrder } from "../typeorm/entities/interfaces/RentalOrderInterface";
import { IRentalOrderRepository } from "../typeorm/repositories/interfaces/IRentalOrderRepository";
import RentalOrderRepository from "../typeorm/repositories/RentalOrderRepository";
import { IRentalOrderService } from "./interfaces/RentalOrderServiceInterface";


export default class RentalOrderService implements IRentalOrderService {
	private repository: IRentalOrderRepository;

	constructor() {
		this.repository = new RentalOrderRepository();
	}

	public async save(order: ICreateRentalOrder): Promise<IRentalOrder> {
		const newOrder = await this.repository.save(order);

		return newOrder;
	}
}
