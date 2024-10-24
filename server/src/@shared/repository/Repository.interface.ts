export default interface IRepository<T> {
  create(input: T): Promise<T>;
  updateBy(id: string, input: T): Promise<T>;
  deleteBy(id: string): Promise<boolean>;
}
