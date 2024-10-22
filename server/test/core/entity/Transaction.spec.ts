import Transaction, { TransactionDirection } from '../../../src/core/entity/Transaction';

let transaction: Transaction;
const input = {
  id:        'id',
  value:     10.5,
  direction: TransactionDirection.IN
};

beforeEach(() => transaction = new Transaction(input.id, input.value, input.direction));

describe('success', () => {
  test('validate transaction instance', () => {
    expect(transaction.id).toBe(input.id);
    expect(transaction.value).toBe(input.value);
    expect(transaction.direction).toBe(input.direction);
  });

  test('transaction instance with value equal 0', () => {
    transaction = new Transaction(input.id, 0, input.direction);
    expect(transaction.id).toBe(input.id);
    expect(transaction.value).toBe(0);
    expect(transaction.direction).toBe(input.direction);
  });
});

describe('fail', () => {
  test('value less than 0', () => {
    expect(() => new Transaction(input.id, -1, input.direction))
      .toThrow('value must be greater or equal 0');
  });
});
