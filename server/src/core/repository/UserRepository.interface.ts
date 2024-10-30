import IRepository from '../../@shared/repository/Repository.interface';
import User from '../entity/User';

export type TLoginInput = { login: string, password: string };

export default interface IUserRepository extends IRepository<User> {
  login(input: TLoginInput): Promise<User>;
  getBy(id: string): Promise<User>;
  getAll(): Promise<User[]>;
  deleteBy(id: string): Promise<boolean>;
}