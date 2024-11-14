import IHttp from "../../http/HTTP.interface";
import CreateHandler from "../../../core/usecase/transaction/Create";
import GetAll from "../../../core/usecase/transaction/GetAll";
import GetByIdHandler from "../../../core/usecase/transaction/GetById";
import Update from "../../../core/usecase/transaction/Update";
import DeleteByIdHandler from "../../../core/usecase/transaction/DeleteById";
import ITransactionRepository from "../../../core/repository/TransactionRepository.interface";
import ICategoryRepository from "../../../core/repository/CategoryRepository.interface";

type TRouteResponse = { statusCode: number; result: any };

export default class TransactionController {
  constructor(
    httpAdapter: IHttp,
    private tRepository: ITransactionRepository,
    private cRepository: ICategoryRepository,
  ) {
    const BASE_URL_PATH = "/transactions";

    httpAdapter.addRoute(
      "post",
      `${BASE_URL_PATH}`,
      this.CreateRoute.bind(this),
    );
    httpAdapter.addRoute(
      "get",
      `${BASE_URL_PATH}/all`,
      this.FindAllRoute.bind(this),
    );
    httpAdapter.addRoute(
      "get",
      `${BASE_URL_PATH}/:id`,
      this.FindByIdRoute.bind(this),
    );
    httpAdapter.addRoute(
      "put",
      `${BASE_URL_PATH}/:id`,
      this.UpdateByIdRoute.bind(this),
    );
    httpAdapter.addRoute(
      "delete",
      `${BASE_URL_PATH}/:id`,
      this.DeleteByIdRoute.bind(this),
    );

    console.log("transaction controller successful loaded");
  }

  private async CreateRoute(req: any, res: any): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const createHandler = new CreateHandler(
        this.tRepository,
        this.cRepository,
      );
      const result = await createHandler.execute({ ...req.body, userId });
      return { statusCode: 201, result };
    } catch (err: any) {
      console.error("failed on route: transaction create, ", err);
      throw new Error(err.message);
    }
  }

  private async FindAllRoute(req: any, res: any): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const getAll = new GetAll(this.tRepository);
      const result = await getAll.execute({ userId });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: transaction find all, ", err);
      throw new Error(err.message);
    }
  }

  private async FindByIdRoute(req: any, res: any): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const findById = new GetByIdHandler(this.tRepository);
      const result = await findById.execute({ userId, id });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: transaction find by id, ", err);
      throw new Error(err?.message);
    }
  }

  private async UpdateByIdRoute(req: any, res: any): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const updateById = new Update(this.tRepository, this.cRepository);
      const result = await updateById.execute({ ...req.body, id, userId });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: update transaction by id", err);
      throw new Error(err.message);
    }
  }

  private async DeleteByIdRoute(req: any, res: any): Promise<TRouteResponse> {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const deleteById = new DeleteByIdHandler(this.tRepository);
      const result = await deleteById.execute({ userId, id });
      return { statusCode: 200, result };
    } catch (err: any) {
      console.error("failed on route: delete transaction by id", err);
      throw new Error(err.message);
    }
  }
}
