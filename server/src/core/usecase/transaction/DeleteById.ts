import ITransactionRepository from "../../repository/TransactionRepository.interface";

type TInput = { id: string; userId: string };

class DeleteByIdHandler {
  constructor(private tRepository: ITransactionRepository) {}

  async execute(input: TInput): Promise<boolean> {
    try {
      return await this.tRepository.deleteBy(input.id, input.userId);
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default DeleteByIdHandler;
