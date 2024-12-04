import { TransactionDirection } from "../../../entity/Transaction";
import IReportRepository, {
  TFilters,
} from "../../../repository/ReportRepository.interface";

type TInput = TFilters & { userId: string };

class ReportAllCountHandler {
  constructor(private rRepository: IReportRepository) {}

  async execute(input: TInput): Promise<number> {
    try {
      const result = await this.rRepository.getAllCountBy(input.userId, {
        ...input,
      });

      return result;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default ReportAllCountHandler;
