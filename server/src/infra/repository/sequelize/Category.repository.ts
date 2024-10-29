import { Sequelize } from 'sequelize-typescript';
import Category from '../../../core/entity/Category';
import CategoryModel from './models/Category.model';
import ICategoryRepository from '../../../core/repository/CategoryRepository.interface';
import { Op } from 'sequelize';

export default class CategoryRepository implements ICategoryRepository {
  private CATEGORY_MODEL;

  constructor(private sequelize: Sequelize){
    this.CATEGORY_MODEL = CategoryModel;
  }

  async create(input: Category): Promise<Category> {
    try{
      const result = (await this.CATEGORY_MODEL.create({
        id:          input.id,
        name:        input.name,
        description: input.description,
        fk_user_id:  input.userId
      }, { raw: true })).dataValues;
      return this.instanceCategoryFrom(result);
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on create new category');
    }
  }

  async getBy(id: string, userId: string): Promise<Category>{
    try{
      const result = await this.CATEGORY_MODEL.findOne({ raw: true, where: { id }});
      if(!result) throw new Error();
      const isFromRespectiveUser = result.fk_user_id === userId;
      if(!isFromRespectiveUser) throw new Error('cannot access category from another user');
      return this.instanceCategoryFrom(result);
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on get category by id');
    }
  }

  async getAllBy(userId: string): Promise<Category[]>{
    try{
      const result: Category[] = [];
      const categories = await this.CATEGORY_MODEL.findAll({ raw: true });
      for(let u of categories) result.push(this.instanceCategoryFrom(u));
      return result;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on get categories');
    }
  }

  async updateBy(id: string, input: Category): Promise<Category>{
    try{
      if(!input.userId) throw new Error('category without user association');
      const verifyIfCategoryExists = await this.getBy(id, input.userId);
      if(!verifyIfCategoryExists) throw new Error();
      const result = await this.CATEGORY_MODEL.update({
        name:        input.name,
        description: input.description
      }, { where: { id }});
      return this.getBy(id, input.userId);
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on update category');
    }
  }

  async deleteBy(id: string, userId: string): Promise<boolean>{
    try{
      const verifyIfCategoryExists = await this.findBy(id);
      if(!verifyIfCategoryExists) throw new Error();
      const result = await this.CATEGORY_MODEL.destroy({ where: { id, fk_user_id: userId }});
      return result === 1;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || 'failed on delete category by id');
    }
  }

  private async findBy(id: string): Promise<Category>{
    try{
      const result = await this.CATEGORY_MODEL.findOne({ raw: true, where: { id }});
      if(!result) throw new Error();
      return this.instanceCategoryFrom(result);
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || err.message || 'failed on get category by id');
    }
  }

  private instanceCategoryFrom(sequelizeResponse: any) {
    return new Category(sequelizeResponse.id, sequelizeResponse.name, sequelizeResponse.description, sequelizeResponse.fk_user_id);
  }
}
