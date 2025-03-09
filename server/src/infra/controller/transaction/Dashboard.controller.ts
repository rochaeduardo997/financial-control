import IHttp from "../../http/HTTP.interface";
import DashboardInOutTotalsHandler from "../../../core/usecase/transaction/dashboard/DashboardInOutTotals";
import IReportRepository from "../../../core/repository/ReportRepository.interface";

type TRouteResponse = { statusCode: number; result: any };

export default class DashboardController {
  constructor(
    httpAdapter: IHttp,
    private rRepository: IReportRepository,
  ) {
    const BASE_URL_PATH = "/dashboard";

    httpAdapter.addRoute(
      "get",
      `${BASE_URL_PATH}/in_out`,
      this.DashboardInOutTotalsRoute.bind(this),
    );

    console.log("transaction dashboard controller successful loaded");
  }

  private async DashboardInOutTotalsRoute(req: any, res: any): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const { year } = req.query;
      const dashboardInOutTotalsHandler = new DashboardInOutTotalsHandler(this.rRepository);
      const result = await dashboardInOutTotalsHandler.execute({ userId, year: year ? year : (new Date).getFullYear() });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: transaction dashboard in/out, ", err);
      throw new Error(err.message);
    }
  }
}
