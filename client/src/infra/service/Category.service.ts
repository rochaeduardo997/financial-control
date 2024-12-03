import Category from "../../../../server/src/core/entity/Category";
import IHTTP from "../http/HTTP.interface";
import HTTP from "../http/HTTP.provider";

class CategoryService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL;

  private httpRequest: IHTTP;

  constructor() {
    this.httpRequest = HTTP;
  }

  async create(input: Category): Promise<Category> {
    try {
      const body = {
        name: input.name,
        description: input.description,
      };
      const { data } = await this.httpRequest.post(
        `${this.API_URL}/categories`,
        body,
      );
      return new Category(
        data.result.id,
        data.result.name,
        data.result.description,
      );
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const { data } = await this.httpRequest.get(
        `${this.API_URL}/categories/all`,
      );
      const categories: Category[] = [];
      for (const category of data.result)
        categories.push(new Category(category.id, category.name));
      return categories;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }

  async findBy(id: string): Promise<Category> {
    try {
      const { data } = await this.httpRequest.get(
        `${this.API_URL}/categories/${id}`,
      );
      return new Category(
        data.result.id,
        data.result.name,
        data.result.description,
      );
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }

  async updateBy(id: string, input: Category): Promise<Category> {
    try {
      const body = {
        name: input.name,
        description: input.description,
      };
      const { data } = await this.httpRequest.put(
        `${this.API_URL}/categories/${id}`,
        body,
      );
      return new Category(
        data.result.id,
        data.result.name,
        data.result.description,
      );
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }

  async deleteBy(id: string): Promise<boolean> {
    try {
      const { data } = await this.httpRequest.delete(
        `${this.API_URL}/categories/${id}`,
      );
      return data.result;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }
}

export default CategoryService;
