import Transaction, {
  TransactionCurrency,
  TransactionDirection,
} from "../../src/core/entity/Transaction";

export default (howMany: number = 1) => {
  const result: Transaction[] = [];
  for (let i = 1; i <= howMany; i++) {
    const rnd = Math.floor(Math.random() * 30) || 10;
    const day = rnd < 10 ? `0${rnd}` : rnd;
    const input = {
      id: `id${i}`,
      name: `name${i}`,
      value: 10.5 + i,
      direction: TransactionDirection.IN,
      when: new Date(`2022-02-${day}T00:00:00`),
      createdAt: new Date(`2022-02-${day}T00:00:00`),
      updatedAt: new Date(`2022-02-${day}T00:00:00`),
      description: `description${i}`,
      currency: TransactionCurrency.EUR,
      quantity: i,
    };
    result.push(
      new Transaction(
        input.id,
        input.name,
        input.value,
        input.direction,
        input.when,
        input.createdAt,
        input.updatedAt,
        undefined,
        input.description,
        input.currency,
        input.quantity,
      ),
    );
  }

  return result;
};
