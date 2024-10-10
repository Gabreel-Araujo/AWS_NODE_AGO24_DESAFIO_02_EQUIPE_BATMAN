import Customer from "../../entities/Customer";

export interface ICustomerPagination {
    per_page: number;
    total: number;
    current_page: number;
    data: Customer[];
  }