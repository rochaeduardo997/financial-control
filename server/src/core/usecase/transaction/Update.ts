import { TransactionDirection } from "../../entity/Transaction";
import ICategoryRepository from "../../repository/CategoryRepository.interface";
import ITransactionRepository from "../../repository/TransactionRepository.interface";

type TInput = {
  id: string;
  name?: string;
  value?: number;
  direction?: TransactionDirection;
  when?: Date;
  categoriesId?: string[];
  userId: string;
  description?: string;
};

type TOutput = {
  id: string;
  name: string;
  value: number;
  direction: TransactionDirection;
  when: Date;
  createdAt: Date;
  updatedAt: Date;
  categoriesId?: string[];
  description?: string;
};

class UpdateHandler {
  constructor(
    private tRepository: ITransactionRepository,
    private cRepository: ICategoryRepository,
  ) {}

  async execute(input: TInput): Promise<TOutput> {
    try {
      const transaction = await this.tRepository.getBy(input.id, input.userId);
      if (input.name) transaction.name = input.name;
      if (input.value) transaction.value = input.value;
      if (input.direction) transaction.direction = input.direction;
      if (input.when) transaction.when = input.when;
      if (input.description) transaction.description = input.description;
      if (input.categoriesId) {
        transaction.cleanupCategories();
        for (const cId of input.categoriesId) {
          const category = await this.cRepository.getBy(cId, input.userId);
          if (!category) continue;
          transaction.associateCategory(category);
        }
      }
      const updatedTransaction = await this.tRepository.updateBy(
        input.id,
        transaction,
      );
      return {
        id: updatedTransaction.id,
        name: updatedTransaction.name,
        value: updatedTransaction.value,
        direction: updatedTransaction.direction,
        when: updatedTransaction.when,
        createdAt: updatedTransaction.createdAt!,
        updatedAt: updatedTransaction.updatedAt!,
        categoriesId: (updatedTransaction.categories || []).map((c) => c.id),
        description: updatedTransaction.description,
      };
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default UpdateHandler;
