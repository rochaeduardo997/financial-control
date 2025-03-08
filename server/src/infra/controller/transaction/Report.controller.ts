import IHttp from "../../http/HTTP.interface";
import ReportHandler from "../../../core/usecase/transaction/report/Report";
import IReportRepository from "../../../core/repository/ReportRepository.interface";
import ReportAllCountHandler from "../../../core/usecase/transaction/report/ReportAllCount";
import ReportAnalyticByCategoryHandler from "../../../core/usecase/transaction/report/ReportAnalyticByCategory";

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

    httpAdapter.addRoute(
      "post",
      `${BASE_URL_PATH}/count/all`,
      this.ReportAllCountRoute.bind(this),
    );

    httpAdapter.addRoute(
      "post",
      `${BASE_URL_PATH}/analytic/category`,
      this.ReportAnalyticByCategory.bind(this),
    );

    console.log("transaction report controller successful loaded");
  }

  private async ReportRoute(req: any, res: any): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const { page, limit } = req.query;
      const reportHandler = new ReportHandler(this.rRepository);
      const result = await reportHandler.execute({
        ...req.body,
        userId,
        page,
        limit,
      });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: transaction report, ", err);
      throw new Error(err.message);
    }
  }

  private async ReportAllCountRoute(
    req: any,
    res: any,
  ): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const reportAllCountHandler = new ReportAllCountHandler(this.rRepository);
      const result = await reportAllCountHandler.execute({
        ...req.body,
        userId,
      });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: transaction all count report, ", err);
      throw new Error(err.message);
    }
  }

  private async ReportAnalyticByCategory(
    req: any,
    res: any,
  ): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const reportAnalyticByCategory = new ReportAnalyticByCategoryHandler(this.rRepository);
      const result = await reportAnalyticByCategory.execute({
        ...req.body,
        userId,
      });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: transaction analytic by category report, ", err);
      throw new Error(err.message);
    }
  }
}
