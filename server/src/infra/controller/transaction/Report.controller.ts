import IHttp from "../../http/HTTP.interface";
import ReportHandler from "../../../core/usecase/transaction/report/Report";
import IReportRepository from "../../../core/repository/ReportRepository.interface";

type TRouteResponse = { statusCode: number; result: any };

export default class ReportController {
  constructor(
    httpAdapter: IHttp,
    private rRepository: IReportRepository,
  ) {
    const BASE_URL_PATH = "/transactions/report";

    httpAdapter.addRoute(
      "post",
      `${BASE_URL_PATH}`,
      this.ReportRoute.bind(this),
    );

    console.log("transaction report controller successful loaded");
  }

  private async ReportRoute(req: any, res: any): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const reportHandler = new ReportHandler(this.rRepository);
      const result = await reportHandler.execute({ ...req.body, userId });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: transaction report, ", err);
      throw new Error(err.message);
    }
  }
}
