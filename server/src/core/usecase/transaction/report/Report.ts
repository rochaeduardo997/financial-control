import { TransactionDirection } from "../../../entity/Transaction";
import IReportRepository, {
  TFilters,
} from "../../../repository/ReportRepository.interface";

type TInput = TFilters & { userId: string; page?: number; limit?: number };
type TOutput = {
  id: string;
  name: string;
  value: number;
  direction: TransactionDirection;
  when: Date;
  categoriesId?: string[];
};

class ReportHandler {
  constructor(private rRepository: IReportRepository) {}

  async execute(input: TInput): Promise<TOutput[]> {
    try {
      const transactions = await this.rRepository.getAllBy(
        input.userId,
        { ...input },
        input.page,
        input.limit,
      );

      const result: TOutput[] = [];
      for (const t of transactions) {
        result.push({
          id: t.id,
          name: t.name,
          value: t.value,
          direction: t.direction,
          when: t.when,
          categoriesId: (t.categories || []).map((c) => c.id),
        });
      }

      return result;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default ReportHandler;
