import { TransactionDirection } from "../../entity/Transaction";
import ITransactionRepository from "../../repository/TransactionRepository.interface";

type TInput = { userId: string };

class GetAllCountHandler {
  constructor(private tRepository: ITransactionRepository) {}

  async execute(input: TInput): Promise<number> {
    try {
      return await this.tRepository.getAllCountBy(input.userId);
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default GetAllCountHandler;
