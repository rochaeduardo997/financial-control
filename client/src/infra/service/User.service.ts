import IHTTP from "../http/HTTP.interface";
import HTTP from "../http/HTTP.provider";
import User from "../../../../server/src/core/entity/User";

class UserService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL;

  private httpRequest: IHTTP;

  constructor() {
    this.httpRequest = HTTP;
  }

  async create(
    name: string,
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      await this.httpRequest.post(`${this.API_URL}/register`, {
        name,
        username,
        email,
        password,
      });
      return;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }

  async updateByTokenId(
    name: string,
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      await this.httpRequest.put(`${this.API_URL}/by_token_id`, {
        name,
        username,
        email,
        password,
      });
      return;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }
}

export default UserService;
