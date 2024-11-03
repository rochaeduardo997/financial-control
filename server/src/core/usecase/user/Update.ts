import { createHash } from "crypto";
import IUserRepository from "../../repository/UserRepository.interface";

type TInput = {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
};

type TOutput = {
  id: string;
  name: string;
  username: string;
  email: string;
};

class UpdateHandler {
  constructor(private uRepository: IUserRepository) {}

  async execute(input: TInput): Promise<TOutput> {
    try {
      const user = await this.uRepository.getBy(input.id);
      if (input.name) user.name = input.name;
      if (input.username) user.username = input.username;
      if (input.email) user.email = input.email;
      if (input.password)
        user.password = createHash("sha512")
          .update(input.password)
          .digest("hex");
      const updatedUser = await this.uRepository.updateBy(input.id, user);
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
      };
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }
}

export default UpdateHandler;
