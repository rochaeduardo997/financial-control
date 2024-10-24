import Transaction, { TransactionDirection } from '../../src/core/entity/Transaction';

export default (howMany: number = 1) => {
  const result: Transaction[] = [];
  for(let i = 1; i <= howMany; i++) {
    const input = {
      id:        `id${i}`,
      name:      `name${i}`,
      value:     10.5 + i,
      direction: TransactionDirection.IN,
      when:      new Date(`2022-02-0${i}T00:00:00`),
      createdAt: new Date(`2022-02-0${i}T00:00:00`),
      updatedAt: new Date(`2022-02-0${i + 2}T00:00:00`)
    };
    result.push(new Transaction(
      input.id,
      input.name,
      input.value,
      input.direction,
      input.when,
      input.createdAt,
      input.updatedAt
    ));
  }

  return result;
}
