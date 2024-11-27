import Transaction, { TransactionDirection } from "../../entity/Transaction";
import ICategoryRepository from "../../repository/CategoryRepository.interface";
import ITransactionRepository from "../../repository/TransactionRepository.interface";

type TBase = {
  name: string;
  value: number;
  direction: TransactionDirection;
  when: Date;
  categoriesId: string[];
};
type TInput = TBase & {
  userId: string;
};
type TOutput = TBase & {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

class CreateHandler {
  constructor(
    private tRepository: ITransactionRepository,
    private cRepository: ICategoryRepository,
  ) {}

  async execute(input: TInput): Promise<TOutput> {
    try {
      const transaction = new Transaction(
        crypto.randomUUID(),
        input.name,
        input.value,
        input.direction,
        input.when,
        new Date(),
        new Date(),
        input.userId,
      );
      await this.associateCategoriesTo(
        transaction,
        input.categoriesId,
        input.userId,
      );
      const createdCategory = await this.tRepository.create(transaction);
      return {
        id: createdCategory.id,
        name: createdCategory.name,
        value: createdCategory.value,
        direction: createdCategory.direction,
        when: createdCategory.when,
        createdAt: createdCategory.createdAt,
        updatedAt: createdCategory.updatedAt,
        categoriesId: (createdCategory.categories || []).map((c) => c.id) || [],
      };
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }

  private async associateCategoriesTo(
    transaction: Transaction,
    categoriesId: string[],
    userId: string,
  ) {
    for (const cId of categoriesId) {
      const c = await this.cRepository.getBy(cId, userId);
      transaction.associateCategory(c);
    }
  }
}

export default CreateHandler;
