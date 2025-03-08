import Transaction, {
  TransactionCurrency,
  TransactionDirection,
} from "../entity/Transaction";

export type TFilters = {
  start: Date;
  end: Date;
  categoriesId?: string[];
  names?: string[];
  valueBetween?: number[];
  direction?: TransactionDirection;
  currency?: TransactionCurrency;
};

export type TAnalitycByCategoryOutput = { [key: string]: number };

export default interface IReportRepository {
  getAllCountBy(userId: string, filters: TFilters): Promise<number>;
  getAnalyticByCategory(userId: string, filters: TFilters): Promise<TAnalitycByCategoryOutput>;
  getAllBy(
    userId: string,
    filters: TFilters,
    page?: number,
    limit?: number,
  ): Promise<Transaction[]>;
}
