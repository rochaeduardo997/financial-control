import ICategoryRepository from "../../repository/CategoryRepository.interface";

type TInput = {
  id: string;
  userId: string;
  name?: string;
  description?: string;
};

type TOutput = {
  id: string;
  name: string;
  description?: string;
};

class UpdateHandler {
  constructor(private cRepository: ICategoryRepository) {}

  async execute(input: TInput): Promise<TOutput> {
    try {
      const category = await this.cRepository.getBy(input.id, input.userId);
      if (input.name) category.name = input.name;
      category.description = input.description!;
      const updatedCategory = await this.cRepository.updateBy(
        input.id,
        category,
      );
      return {
        id: updatedCategory.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
      };
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default UpdateHandler;
