import ICategoryRepository from "../../repository/CategoryRepository.interface";
import Category from "../../entity/Category";

type TInput = {
  name: string;
  description?: string;
  userId: string;
};

type TOutput = {
  id: string;
  name: string;
  description?: string;
  userId: string;
};

class CreateHandler {
  constructor(private cRepository: ICategoryRepository) {}

  async execute(input: TInput): Promise<TOutput> {
    try {
      const category = new Category(
        crypto.randomUUID(),
        input.name,
        input.description,
        input.userId,
      );
      const createdCategory = await this.cRepository.create(category);
      return {
        id: createdCategory.id,
        name: createdCategory.name,
        description: createdCategory.description,
        userId: createdCategory.userId!,
      };
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default CreateHandler;
