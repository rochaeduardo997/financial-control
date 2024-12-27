import IHTTP from "../http/HTTP.interface";
import HTTP from "../http/HTTP.provider";

class LogoutService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL;

  private httpRequest: IHTTP;

  constructor() {
    this.httpRequest = HTTP;
  }

  async logout(): Promise<boolean> {
    try {
      await this.httpRequest.get(`${this.API_URL}/logout`);
      return true;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }
}

export default LogoutService;
