import { TransactionDirection } from "../../../entity/Transaction";
import IReportRepository, {
  TFilters, TAnalyticByCategoryOutput
} from "../../../repository/ReportRepository.interface";

type TInput = TFilters & { userId: string };

class ReportAnalyticByCategoryHandler {
  constructor(private rRepository: IReportRepository) {}

  async execute(input: TInput): Promise<TAnalyticByCategoryOutput> {
    try {
      const result = await this.rRepository.getAnalyticByCategory(input.userId, { ...input });
      return result;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default ReportAnalyticByCategoryHandler;
