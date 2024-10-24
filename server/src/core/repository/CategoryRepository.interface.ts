import IRepository from '../../@shared/repository/Repository.interface';
import Category from '../entity/Category';

export default interface ICategoryRepository extends IRepository<Category> {
  getBy(id: string, userId: string): Promise<Category>;
  getAllBy(userId: string): Promise<Category[]>;
}

