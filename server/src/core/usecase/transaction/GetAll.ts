import { TransactionDirection } from "../../entity/Transaction";
import ITransactionRepository from "../../repository/TransactionRepository.interface";

type TInput = { userId: string; page?: number; limit?: number };

type TOutput = {
  id: string;
  name: string;
  value: number;
  direction: TransactionDirection;
  when: Date;
};

class GetAllHandler {
  constructor(private tRepository: ITransactionRepository) {}

  async execute(input: TInput): Promise<TOutput[]> {
    try {
      const result: TOutput[] = [];
      const transactions = await this.tRepository.getAllBy(
        input.userId,
        input.page,
        input.limit,
      );
      for (const t of transactions)
        result.push({
          id: t.id,
          name: t.name,
          value: t.value,
          direction: t.direction,
          when: t.when,
        });
      return result;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default GetAllHandler;
