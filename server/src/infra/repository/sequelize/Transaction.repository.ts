import { Transaction as TX } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import Category from "../../../core/entity/Category";
import Transaction from "../../../core/entity/Transaction";
import ICategoryRepository from "../../../core/repository/CategoryRepository.interface";
import ITransactionRepository from "../../../core/repository/TransactionRepository.interface";
import CategoryRepository from "./Category.repository";
import TransactionModel from "./models/Transaction.model";
import TransactionCategoryRelationModel from "./models/TransactionCategoryRelation.model";
import InstanceTransaction from "../../../@shared/sequelize/InstanceTransaction";

export default class TransactionRepository implements ITransactionRepository {
  private TRANSACTION_MODEL;
  private TRANSACTION_CATEGORIES_RELATION_MODEL;
  private categoryRepository: ICategoryRepository;

  constructor(private sequelize: Sequelize) {
    this.TRANSACTION_MODEL = TransactionModel;
    this.TRANSACTION_CATEGORIES_RELATION_MODEL =
      TransactionCategoryRelationModel;
    this.categoryRepository = new CategoryRepository(this.sequelize);
  }

  async create(input: Transaction): Promise<Transaction> {
    const transaction = await this.sequelize.transaction();
    try {
      const transactions = (
        await this.TRANSACTION_MODEL.create(
          {
            id: input.id,
            name: input.name,
            value: input.value,
            direction: input.direction,
            when: input.when,
            description: input.description,
            currency: input.currency,
            quantity: input.quantity,
            fk_user_id: input.userId,
          },
          { raw: true, transaction },
        )
      ).dataValues;
      const categories = await this.reinsertAssociationWithCategoriesBy(
        transactions.id,
        transactions.fk_user_id,
        input.categories,
        transaction,
      );
      const result = InstanceTransaction(transactions);
      for (const c of categories) result.associateCategory(c);
      await transaction.commit();
      return result;
    } catch (err: any) {
      await transaction.rollback();
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on create new transaction",
      );
    }
  }

  async getBy(id: string, userId: string): Promise<Transaction> {
    try {
      const transaction = await this.TRANSACTION_MODEL.findOne({
        where: { id },
        include: { model: TransactionCategoryRelationModel },
      });
      if (!transaction) throw new Error();
      const isFromRespectiveUser = transaction.fk_user_id === userId;
      if (!isFromRespectiveUser)
        throw new Error("cannot access transaction from another user");
      const result = InstanceTransaction(transaction);
      for (const c of transaction.categories) {
        const category = await this.categoryRepository.getBy(
          c.fk_category_id,
          userId,
        );
        result.associateCategory(category);
      }
      return result;
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on get transaction by id",
      );
    }
  }

  async getAllCountBy(userId: string): Promise<number> {
    try {
      return this.TRANSACTION_MODEL.count({ where: { fk_user_id: userId } });
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
    page: number = 0,
    limit: number = 25,
  ): Promise<Transaction[]> {
    limit = limit >= 100 ? 100 : limit;

    const offset = (page - 1) * limit;

    try {
      const result: Transaction[] = [];
      const transactions = await this.TRANSACTION_MODEL.findAll({
        where: { fk_user_id: userId },
        offset,
        limit,
        order: [["createdAt", "ASC"]],
      });
      for (let t of transactions) result.push(InstanceTransaction(t));
      return result;
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on get transactions",
      );
    }
  }

  async updateBy(id: string, input: Transaction): Promise<Transaction> {
    const tx = await this.sequelize.transaction();
    try {
      if (!input.userId)
        throw new Error("transaction without user association");
      const verifyIfTransactionExists = await this.getBy(id, input.userId);
      if (!verifyIfTransactionExists) throw new Error();
      await this.TRANSACTION_MODEL.update(
        {
          name: input.name,
          value: input.value,
          direction: input.direction,
          when: input.when,
          description: input.description,
          currency: input.currency,
          quantity: input.quantity,
          fk_user_id: input.userId,
          updated_at: new Date(),
        },
        { where: { id }, transaction: tx },
      );
      await this.reinsertAssociationWithCategoriesBy(
        id,
        input.userId,
        input.categories,
        tx,
      );
      await tx.commit();
      return this.getBy(id, input.userId);
    } catch (err: any) {
      await tx.rollback();
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on update transaction",
      );
    }
  }

  async deleteBy(id: string, userId: string): Promise<boolean> {
    try {
      const verifyIfTransactionExists = await this.findBy(id);
      if (!verifyIfTransactionExists) throw new Error();
      const result = await this.TRANSACTION_MODEL.destroy({
        where: { id, fk_user_id: userId },
      });
      if (result !== 1) throw new Error();
      return true;
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message || "failed on delete transaction by id",
      );
    }
  }

  private async reinsertAssociationWithCategoriesBy(
    transactionId: string,
    userId: string,
    categories: Category[],
    transaction: TX,
  ): Promise<Category[]> {
    const result: Category[] = [];
    await this.TRANSACTION_CATEGORIES_RELATION_MODEL.destroy({
      where: { fk_transaction_id: transactionId },
      transaction,
    });
    for (const c of categories) {
      const _c = (
        await this.TRANSACTION_CATEGORIES_RELATION_MODEL.create(
          {
            fk_category_id: c.id,
            fk_transaction_id: transactionId,
            fk_user_id: userId,
          },
          { raw: true, transaction },
        )
      ).dataValues;
      const category = await this.categoryRepository.getBy(
        _c.fk_category_id,
        userId,
      );
      result.push(category);
    }
    return result;
  }

  private async findBy(id: string): Promise<Transaction> {
    try {
      const result = await this.TRANSACTION_MODEL.findOne({
        raw: true,
        where: { id },
      });
      if (!result) throw new Error();
      return InstanceTransaction(result);
    } catch (err: any) {
      console.error(err);
      throw new Error(
        err?.errors?.[0]?.message ||
          err.message ||
          "failed on get transaction by id",
      );
    }
  }
}
