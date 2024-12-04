import ITransactionRepository from "../repository/TransactionRepository.interface";
import ICategoryRepository from "../repository/CategoryRepository.interface";
import IUserRepository from "../repository/UserRepository.interface";
import IReportRepository from "../repository/ReportRepository.interface";

export default interface IRepositoryFactory {
  transaction(): ITransactionRepository;
  category(): ICategoryRepository;
  user(): IUserRepository;
  report(): IReportRepository;
}
