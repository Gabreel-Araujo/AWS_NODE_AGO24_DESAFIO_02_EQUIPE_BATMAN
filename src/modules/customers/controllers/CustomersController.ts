import { Request, Response } from "express";
import GetByIdCustomerService from "../services/GetByIdCustomerService";

export default class CustomersController {
    public async getById(req: Request, res: Response):Promise <Response> {
        try {
            const getByIdCustomerService = new GetByIdCustomerService();
            const {id} = req.params;
            const costumer = await getByIdCustomerService.execute({ id });
            return res.status(200).json(costumer)
        } catch (error) {
            console.error(error)
            return res.status(error.statusCode).json("Customer não encontrado.")
        }
    }
}