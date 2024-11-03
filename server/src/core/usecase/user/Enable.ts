import { createHash } from "crypto";
import IUserRepository from "../../repository/UserRepository.interface";

type TInput = { id: string };

class EnableHandler {
  constructor(private uRepository: IUserRepository) {}

  async execute(input: TInput): Promise<boolean> {
    try {
      const user = await this.uRepository.getBy(input.id);
      return this.uRepository.enableBy(input.id);
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default EnableHandler;
