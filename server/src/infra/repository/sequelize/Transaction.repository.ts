import { Transaction as TX } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import Category from '../../../core/entity/Category';
import Transaction from '../../../core/entity/Transaction';
import ITransactionRepository from '../../../core/repository/TransactionRepository.interface';
import TransactionModel from './models/Transaction.model';
import TransactionCategoryRelationModel from './models/TransactionCategoryRelation.model';
import ICategoryRepository from '../../../core/repository/CategoryRepository.interface';
import CategoryRepository from './Category.repository';
import { Op } from 'sequelize';

export default class TransactionRepository implements ITransactionRepository {
  private TRANSACTION_MODEL;
  private TRANSACTION_CATEGORIES_RELATION_MODEL;
  private categoryRepository: ICategoryRepository;

  constructor(private sequelize: Sequelize){
    this.TRANSACTION_MODEL                     = TransactionModel;
    this.TRANSACTION_CATEGORIES_RELATION_MODEL = TransactionCategoryRelationModel;
    this.categoryRepository = new CategoryRepository(this.sequelize);
  }

  async create(input: Transaction): Promise<Transaction> {
    const transaction = await this.sequelize.transaction();
    try{
      const transactions = (await this.TRANSACTION_MODEL.create({
        id:         input.id,
        name:       input.name,
        value:      input.value,
        direction:  input.direction,
        when:       input.when,
        fk_user_id: input.userId
      }, { raw: true, transaction })).dataValues;
      const categories = await this.reinsertAssociationWithCategoriesBy(transactions.id, transactions.fk_user_id, input.categories, transaction);
      const result = this.instanceTransactionFrom(transactions);
      for(const c of categories) result.associateCategory(c);
      await transaction.commit();
      return result
    }catch(err: any){
      await transaction.rollback();
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on create new transaction');
    }
  }

  async getBy(id: string, userId: string): Promise<Transaction>{
    try{
      throw new Error();
      // const result = await this.TRANSACTION_MODEL.findOne({ raw: true, where: { id }});
      // if(!result) throw new Error();
      // const isFromRespectiveUser = result.fk_user_id === userId;
      // if(!isFromRespectiveUser) throw new Error('cannot access transaction from another user');
      // return this.instanceTransactionFrom(result);
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on get transaction by id');
    }
  }

  async getAllBy(userId: string): Promise<Transaction[]>{
    try{
      throw new Error();
      // const result: Transaction[] = [];
      // const transactions = await this.TRANSACTION_MODEL.findAll({ raw: true });
      // for(let u of transactions) result.push(this.instanceTransactionFrom(u));
      // return result;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on get transactions');
    }
  }

  async updateBy(id: string, input: Transaction): Promise<Transaction>{
    try{
      throw new Error();
      // if(!input.userId) throw new Error('transaction without user association');
      // const verifyIfTransactionExists = await this.getBy(id, input.userId);
      // if(!verifyIfTransactionExists) throw new Error();
      // const result = await this.TRANSACTION_MODEL.update({
      //   name:        input.name,
      //   description: input.description
      // }, { where: { id }});
      // return this.getBy(id, input.userId);
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on update transaction');
    }
  }

  async deleteBy(id: string): Promise<boolean>{
    try{
      throw new Error();
      // const verifyIfTransactionExists = await this.findBy(id);
      // if(!verifyIfTransactionExists) throw new Error();
      // const result = await this.TRANSACTION_MODEL.destroy({ where: { id }});
      // return result === 1;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || 'failed on delete transaction by id');
    }
  }

  private async reinsertAssociationWithCategoriesBy(transactionId: string, userId: string, categories: Category[], transaction: TX): Promise<Category[]>{
    const result: Category[] = [];
    for(const c of categories) {
      const _c = (await this.TRANSACTION_CATEGORIES_RELATION_MODEL.create({
        fk_category_id:    c.id,
        fk_transaction_id: transactionId,
        fk_user_id:        userId
      }, { raw: true, transaction })).dataValues;
      const category = await this.categoryRepository.getBy(_c.fk_category_id, userId);
      result.push(category);
    }
    return result;
  }

  private async findBy(id: string): Promise<Transaction>{
    try{
      const result = await this.TRANSACTION_MODEL.findOne({ raw: true, where: { id }});
      if(!result) throw new Error();
      return this.instanceTransactionFrom(result);
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on get transaction by id');
    }
  }

  private instanceTransactionFrom(sequelizeResponse: any) {
    return new Transaction(
      sequelizeResponse.id,
      sequelizeResponse.name,
      sequelizeResponse.value,
      sequelizeResponse.direction,
      sequelizeResponse.when,
      sequelizeResponse.createdAt,
      sequelizeResponse.updatedAt,
      sequelizeResponse.fk_user_id
    );
  }
}
