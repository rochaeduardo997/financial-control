import IHTTP from "../http/HTTP.interface";
import HTTP from "../http/HTTP.provider";

type TLoginOutput = {
  id: string;
  email: string;
  username: string;
  name: string;
  status: boolean;
  token: string;
};

class LoginService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL;

  private httpRequest: IHTTP;

  constructor() {
    this.httpRequest = HTTP;
  }

  async login(login: string, password: string): Promise<TLoginOutput> {
    try {
      const { data } = await this.httpRequest.post(`${this.API_URL}/login`, {
        login,
        password,
      });
      return {
        id: data.result.id,
        email: data.result.email,
        username: data.result.username,
        name: data.result.name,
        status: data.result.status,
        token: data.result.token,
      };
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }
}

export default LoginService;
