import IUserRepository from "../../repository/UserRepository.interface";

type TInput = { id: string };

class DeleteByIdHandler {
  constructor(private uRepository: IUserRepository) {}

  async execute(input: TInput): Promise<boolean> {
    try {
      return await this.uRepository.deleteBy(input.id);
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default DeleteByIdHandler;
