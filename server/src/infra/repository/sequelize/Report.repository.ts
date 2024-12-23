import { Sequelize } from "sequelize-typescript";
import Transaction from "../../../core/entity/Transaction";
import IReportRepository, {
  TFilters,
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

  async getAllCountBy(userId: string, filters: TFilters): Promise<number> {
    try {
      const [[total]]: any = await this.getTransactions(
        0,
        0,
        filters,
        userId,
        true,
      );
      return +total?.total || 0;
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
      const [transactions] = await this.getTransactions(
        limit,
        offset,
        filters,
        userId,
      );
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

  private async getTransactions(
    limit: number,
    offset: number,
    filters: TFilters,
    userId: string,
    isCount: boolean = false,
  ) {
    let where = `WHERE
      "when" BETWEEN '${new Date(filters.start).toISOString()}' AND '${new Date(filters.end).toISOString()}'
      AND t.fk_user_id = '${userId}'
    `;

    where = this.makeFilters(where, filters);
    if (isCount)
      return this.sequelize.query({
        query: `
          SELECT COUNT(DISTINCT(t.id)) AS 'total'
          ${this.TABLE_JOINS} ${where}
        `,
        values: [],
      });
    else
      return this.sequelize.query({
        query: `
        SELECT DISTINCT(t.id), t.*
        ${this.TABLE_JOINS} ${where}
        ORDER BY t.createdAt ASC
        LIMIT ? OFFSET ?
      `,
        values: [limit, offset],
      });
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
