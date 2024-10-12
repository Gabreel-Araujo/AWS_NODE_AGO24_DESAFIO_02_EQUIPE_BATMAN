import Customer from "../../typeorm/entities/Customer";

export interface CustomerPaginationServiceInterface {
    per_page: number;
    total: number;
    current_page: number;
    data: Customer[];
  }