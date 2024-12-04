import { Sequelize } from "sequelize-typescript";
import Transaction from "../../../core/entity/Transaction";
import IReportRepository, {
  TFilters,
} from "../../../core/repository/ReportRepository.interface";
import ICategoryRepository from "../../../core/repository/CategoryRepository.interface";
import CategoryRepository from "./Category.repository";
import Category from "../../../core/entity/Category";

export default class ReportRepository implements IReportRepository {
  private categoryRepository: ICategoryRepository;

  constructor(private sequelize: Sequelize) {
    this.categoryRepository = new CategoryRepository(this.sequelize);
  }

  async getAllCountBy(userId: string, filters: TFilters): Promise<number> {
    try {
      return 0;
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on get transactions count",
      );
    }
  }

  async getAllBy(
    userId: string,
    filters: TFilters,
    page: number = 0,
    limit: number = 25,
  ): Promise<Transaction[]> {
    limit = limit >= 100 ? 100 : limit;
    const offset = (page - 1) * limit;

    const TABLE_JOINS = `FROM transaction_category_relation tcr
      JOIN transactions t ON tcr.fk_transaction_id = t.id
      JOIN categories c ON tcr.fk_category_id = c.id
    `;

    let where = `WHERE
      "when" BETWEEN '${new Date(filters.start).toISOString()}' AND '${new Date(filters.end).toISOString()}'
      AND tcr.fk_user_id = '${userId}'
    `;

    where = this.makeFilters(where, filters);

    try {
      const [transactions] = await this.getTransactions(
        TABLE_JOINS,
        where,
        limit,
        offset,
      );
      const [categoriesId] = await this.getCategoriesId(TABLE_JOINS);

      const categories = await this.categoryRepository.getAllBy(userId);
      const result: Transaction[] = await this.getTransactionsInstance(
        transactions,
        categories,
        categoriesId,
        userId,
      );

      return result;
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on get transactions report",
      );
    }
  }

  private makeFilters(where: string, filters: TFilters) {
    if (filters.categoriesId?.length)
      where = this.makeSimpleArrayFilter(where, filters.categoriesId, "c.id");

    if (filters.valueBetween?.length) {
      const v1 = filters.valueBetween[0] || 0;
      const v2 = filters.valueBetween[1] || v1 + 1;
      where = where.concat(`AND t.value BETWEEN ${v1} AND ${v2}`);
    }

    if (filters.names?.length)
      where = this.makeLikeArrayFilter(where, filters.names, "t.name");
    return where;
  }

  private makeSimpleArrayFilter(
    where: string,
    filters: string[],
    column: string,
  ) {
    const toFilters = filters.map((x) => `'${x}'`);
    where = where.concat(` AND (${column} = ${toFilters[0]} `);
    for (let i = 1; i < toFilters.length; i++)
      where = where.concat(`OR ${column} = ${toFilters[i]}`);
    return where.concat(")");
  }

  private makeLikeArrayFilter(
    where: string,
    filters: string[],
    column: string,
  ) {
    const toFilter = (filters || []).map(
      (n) => `LOWER(${column}) LIKE LOWER('%${n}%')`,
    );
    where = where.concat("AND");
    return `${where} (${toFilter.join(" OR ")})`;
  }

  private async getTransactions(
    TABLE_JOINS: string,
    where: string,
    limit: number,
    offset: number,
  ) {
    return this.sequelize.query({
      query: `
        SELECT DISTINCT(t.id), t.*
        ${TABLE_JOINS} ${where}
        LIMIT ? OFFSET ?
      `,
      values: [limit, offset],
    });
  }

  private async getCategoriesId(TABLE_JOINS: string) {
    return this.sequelize.query({
      query: `SELECT t.id, tcr.fk_category_id ${TABLE_JOINS}`,
      values: [],
    });
  }

  private async getTransactionsInstance(
    transactions: any,
    categories: Category[],
    categoriesId: any,
    userId: string,
  ) {
    const result: Transaction[] = [];
    for (const t of transactions as any) {
      const transaction = this.instanceTransactionFrom(t);

      const tCategoriesId: any = categoriesId.filter((c: any) => c.id === t.id);
      for (const tCId of tCategoriesId) {
        const c = categories.find(({ id }) => id === tCId.fk_category_id);
        if (!c) continue;
        transaction.associateCategory(c);
      }

      result.push(transaction);
    }
    return result;
  }

  private instanceTransactionFrom(sequelizeResponse: any) {
    return new Transaction(
      sequelizeResponse.id,
      sequelizeResponse.name,
      sequelizeResponse.value,
      sequelizeResponse.direction,
      new Date(sequelizeResponse.when),
      new Date(sequelizeResponse.createdAt),
      new Date(sequelizeResponse.updatedAt),
      sequelizeResponse.fk_user_id,
      sequelizeResponse.description,
    );
  }
}
