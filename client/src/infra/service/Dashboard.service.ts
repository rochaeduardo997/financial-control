import IHTTP from "../http/HTTP.interface";
import HTTP from "../http/HTTP.provider";
import Transaction from "../../../../server/src/core/entity/Transaction";
import { TFilters, TDashboardInOut } from "../../../../server/src/core/repository/ReportRepository.interface";

class DashboardService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL;

  private httpRequest: IHTTP;

  constructor() {
    this.httpRequest = HTTP;
  }

  async getDashboardInOutTotals(year: number): Promise<TDashboardInOut> {
    try {
      const { data } = await this.httpRequest.get(`${this.API_URL}/dashboard/in_out?year=${year}`);
      return data.result;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }
}

export default DashboardService;
