import Transaction, { TransactionDirection } from "../entity/Transaction";

export type TFilters = {
  start: Date;
  end: Date;
  categoriesId?: string[];
  names?: string[];
  valueBetween?: number[];
  direction?: TransactionDirection;
};

export default interface IReportRepository {
  getAllCountBy(userId: string, filters: TFilters): Promise<number>;
  getAllBy(
    userId: string,
    filters: TFilters,
    page?: number,
    limit?: number,
  ): Promise<Transaction[]>;
}
