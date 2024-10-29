import IRepository from '../../@shared/repository/Repository.interface';
import Transaction from '../entity/Transaction';

export default interface ITransactionRepository extends IRepository<Transaction> {
  getBy(id: string, userId: string): Promise<Transaction>;
  getAllCountBy(userId: string): Promise<number>;
  getAllBy(userId: string, page: number): Promise<Transaction[]>;
}

