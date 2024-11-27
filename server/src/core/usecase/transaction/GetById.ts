import { TransactionDirection } from "../../entity/Transaction";
import ITransactionRepository from "../../repository/TransactionRepository.interface";

type TInput = { id: string; userId: string };

type TOutput = {
  id: string;
  name: string;
  value: number;
  direction: TransactionDirection;
  when: Date;
  createdAt: Date;
  updatedAt: Date;
  categoriesId: string[];
};

class GetByIdHandler {
  constructor(private tRepository: ITransactionRepository) {}

  async execute(input: TInput): Promise<TOutput> {
    try {
      const result = await this.tRepository.getBy(input.id, input.userId);
      return {
        id: result.id,
        name: result.name,
        value: result.value,
        direction: result.direction,
        when: result.when,
        createdAt: result.createdAt!,
        updatedAt: result.updatedAt!,
        categoriesId: (result.categories || []).map((c) => c.id),
      };
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default GetByIdHandler;
