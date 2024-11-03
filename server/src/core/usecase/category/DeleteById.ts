import ICategoryRepository from "../../repository/CategoryRepository.interface";

type TInput = { id: string; userId: string };

class DeleteByIdHandler {
  constructor(private cRepository: ICategoryRepository) {}

  async execute(input: TInput): Promise<boolean> {
    try {
      return await this.cRepository.deleteBy(input.id, input.userId);
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default DeleteByIdHandler;
