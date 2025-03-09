import { TransactionDirection } from "../../../entity/Transaction";
import IReportRepository, {
  TFilters, TDashboardInOut
} from "../../../repository/ReportRepository.interface";

type TInput = { userId: string, year: number };

class DashboardInOutTotalsHandler {
  constructor(private rRepository: IReportRepository) {}

  async execute(input: TInput): Promise<TDashboardInOut> {
    try {
      const result = await this.rRepository.getDashboardInOutTotals(input.userId, input.year);
      return result;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default DashboardInOutTotalsHandler;
