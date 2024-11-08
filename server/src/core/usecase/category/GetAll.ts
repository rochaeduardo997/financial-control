import ICategoryRepository from "../../repository/CategoryRepository.interface";

type TInput = { userId: string };

type TOutput = {
  id: string;
  name: string;
  description?: string;
};

class GetAllHandler {
  constructor(private cRepository: ICategoryRepository) {}

  async execute(input: TInput): Promise<TOutput[]> {
    try {
      const result: TOutput[] = [];
      const categories = await this.cRepository.getAllBy(input.userId);
      for (const c of categories)
        result.push({
          id: c.id,
          name: c.name,
          description: c.description,
        });
      return result;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default GetAllHandler;
