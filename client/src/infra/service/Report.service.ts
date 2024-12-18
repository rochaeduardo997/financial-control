import IHTTP from "../http/HTTP.interface";
import HTTP from "../http/HTTP.provider";
import Transaction from "../../../../server/src/core/entity/Transaction";
import { TFilters } from "../../../../server/src/core/repository/ReportRepository.interface";

class ReportService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL;

  private httpRequest: IHTTP;

  constructor() {
    this.httpRequest = HTTP;
  }

  async findAllCount(filters: TFilters): Promise<number> {
    try {
      const { data } = await this.httpRequest.post(
        `${this.API_URL}/transactions/report/count/all`,
        { ...filters },
      );
      return data.result;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }

  async findAll(
    page: number = 0,
    limit: number = 25,
    filters: TFilters,
  ): Promise<Transaction[]> {
    try {
      const { data } = await this.httpRequest.post(
        `${this.API_URL}/transactions/report?page=${page}&limit=${limit}`,
        { ...filters },
      );
      const transactions: Transaction[] = [];
      for (const transaction of data.result)
        transactions.push(
          new Transaction(
            transaction.id,
            transaction.name,
            transaction.value,
            transaction.direction,
            transaction.when,
            undefined,
            undefined,
            undefined,
            transaction.description,
            transaction.currency,
          ),
        );
      return transactions;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }
}

export default ReportService;
