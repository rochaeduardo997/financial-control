import { Sequelize } from "sequelize-typescript";
import Transaction from "../../../core/entity/Transaction";
import IReportRepository, {
  TFilters, TAnalyticByCategoryOutput, TDashboardInOut
} from "../../../core/repository/ReportRepository.interface";
import ICategoryRepository from "../../../core/repository/CategoryRepository.interface";
import CategoryRepository from "./Category.repository";
import Category from "../../../core/entity/Category";
import InstanceTransaction from "../../../@shared/sequelize/InstanceTransaction";

export default class ReportRepository implements IReportRepository {
  private categoryRepository: ICategoryRepository;
  private TABLE_JOINS: string;

  constructor(private sequelize: Sequelize) {
    this.categoryRepository = new CategoryRepository(this.sequelize);
    this.TABLE_JOINS = `FROM transaction_category_relation tcr
      FULL JOIN transactions t ON tcr.fk_transaction_id = t.id
      FULL JOIN categories c ON tcr.fk_category_id = c.id
    `;
  }

  async getDashboardInOutTotals(userId: string, year: number): Promise<TDashboardInOut> {
    try {
      const where = await this.prepareWhere(
        { start: new Date(`01-01-${year}`), end: new Date(`01-01-${++year}`) },
        userId,
        true,
      );
      const [queryResult]: any = await this.sequelize.query({
        query: `
          SELECT DISTINCT(t.id), t.direction AS 'direction', t.value
          ${this.TABLE_JOINS} ${where}
        `,
        values: [],
      });
      const result: any = {in: 0, out: 0};
      for(const qR of queryResult) result[qR.direction] += qR.value;
      return result;
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on get transactions count",
      );
    }
  }

  async getAllCountBy(userId: string, filters: TFilters): Promise<number> {
    try {
      const where = await this.prepareWhere(
        filters,
        userId,
        true,
      );
      const [[{total}]]: any = await this.sequelize.query({
        query: `
          SELECT COUNT(DISTINCT(t.id)) AS 'total'
          ${this.TABLE_JOINS} ${where}
        `,
        values: [],
      });
      return +total || 0;
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on get transactions count",
      );
    }
  }

  async getAnalyticByCategory(userId: string, filters: TFilters): Promise<TAnalyticByCategoryOutput> {
    try {
      const where = await this.prepareWhere(
        filters,
        userId,
      );
      const [queryResult]: any = await this.sequelize.query({
        query: `
          SELECT c.name AS 'category', SUM(t.value) AS 'value'
          ${this.TABLE_JOINS} ${where}
          GROUP BY c.name
        `,
        values: [],
      });
      const result: TAnalyticByCategoryOutput = {};
      for(const qR of queryResult) result[qR.category] = qR.value;
      return result;
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

    try {
      const where = await this.prepareWhere(
        filters,
        userId,
      );
      const [transactions] = await this.sequelize.query({
        query: `
        SELECT DISTINCT(t.id), t.*
        ${this.TABLE_JOINS} ${where}
        ORDER BY t.createdAt ASC
        LIMIT ? OFFSET ?
      `,
        values: [limit, offset],
      });
      const [categoriesId] = await this.getCategoriesId();

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

  private async prepareWhere(
    filters: TFilters,
    userId: string,
    isCount: boolean = false,
  ) {
    let where = `WHERE
      "when" BETWEEN '${new Date(filters.start).toISOString()}' AND '${new Date(filters.end).toISOString()}'
      AND t.fk_user_id = '${userId}'
    `;

    where = this.makeFilters(where, filters);
    return where;
  }

  private makeFilters(where: string, filters: TFilters) {
    if (filters.categoriesId?.length)
      where = this.makeSimpleArrayFilter(where, filters.categoriesId, "c.id");

    if (filters.valueBetween?.length) {
      const v1 = filters.valueBetween[0] || 0;
      const v2 = filters.valueBetween[1] || v1 + 1;
      where = where.concat(`AND t.value BETWEEN ${v1} AND ${v2} `);
    }

    if (filters.names?.length)
      where = this.makeLikeArrayFilter(where, filters.names, "t.name");

    if (filters.direction)
      where = this.makeLikeArrayFilter(
        where,
        [filters.direction],
        "t.direction",
      );

    if (filters.currency)
      where = this.makeSimpleArrayFilter(
        where,
        [filters.currency],
        "t.currency",
      );

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

  private async getCategoriesId() {
    return this.sequelize.query({
      query: `SELECT t.id, tcr.fk_category_id ${this.TABLE_JOINS}`,
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
      const transaction = InstanceTransaction(t);

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
}
