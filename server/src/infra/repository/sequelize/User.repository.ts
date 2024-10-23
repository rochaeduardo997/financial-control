import { Sequelize } from 'sequelize-typescript';
import User from '../../../core/entity/User';
import UserModel from './models/User.model';
import IUserRepository, { TLoginInput } from '../../../core/repository/UserRepository.interface';
import { Op } from 'sequelize';

export default class UserRepository implements IUserRepository {
  private USER_MODEL;

  constructor(private sequelize: Sequelize){
    this.USER_MODEL = UserModel;
  }

  async create(input: User): Promise<User> {
    try{
      const result = (await this.USER_MODEL.create({
        id:       input.id,
        name:     input.name,
        username: input.username,
        email:    input.email,
        password: input.password,
        status:   input.status,
        role:     input.role
      }, { raw: true })).dataValues;
      return new User(result.id, result.name, result.username, result.email, result.password, result.status, result.role, result.createdAt, result.updatedAt);
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || 'failed on create new user');
    }
  }

  async getBy(id: string): Promise<User>{ throw new Error(); }
  async getAll(): Promise<User[]>{ throw new Error(); }
  async updateBy(id: string, input: User): Promise<User>{ throw new Error(); }
  async deleteBy(id: string): Promise<User>{ throw new Error(); }
}
