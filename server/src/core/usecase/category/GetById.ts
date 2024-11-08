import ICategoryRepository from "../../repository/CategoryRepository.interface";

type TInput = { id: string; userId: string };

type TOutput = {
  id: string;
  name: string;
  description?: string;
  userId: string;
};

class GetByIdHandler {
  constructor(private cRepository: ICategoryRepository) {}

  async execute(input: TInput): Promise<TOutput> {
    try {
      const category = await this.cRepository.getBy(input.id, input.userId);
      const result = {
        id: category.id,
        name: category.name,
        description: category.description,
        userId: category.userId!,
      };
      return result;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default GetByIdHandler;
