import { createHash } from "crypto";
import IUserRepository from "../../repository/UserRepository.interface";
import ICache from "../../../infra/cache/cache.interface";

type TInput = { id: string };

class DisableHandler {
  constructor(
    private uRepository: IUserRepository,
    private cache: ICache,
  ) {}

  async execute(input: TInput): Promise<boolean> {
    try {
      const user = await this.uRepository.getBy(input.id);
      const result = await this.uRepository.disableBy(input.id);
      await this.cache.listDeleteAllBy(`session:${input.id}`);
      return result;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default DisableHandler;
