import Transaction, { TransactionDirection } from '../../../src/core/entity/Transaction';
import Category from '../../../src/core/entity/Category';

let transaction: Transaction;
const categories = [ new Category('id', 'name', 'description', 'userId') ];
const input = {
  id:        'id',
  name:      'name',
  value:     10.5,
  direction: TransactionDirection.IN,
  when:      new Date('2022-05-04T00:00:00'),
  createdAt: new Date('2022-05-05T00:00:00'),
  updatedAt: new Date('2022-05-06T00:00:00'),
  userId:    'userId'
};

beforeEach(() => {
  transaction = new Transaction(input.id, input.name, input.value, input.direction, input.when, input.createdAt, input.updatedAt, input.userId)
  for(const c of categories) transaction.associateCategory(c);
});

describe('success', () => {
  test('validate transaction instance', () => {
    expect(transaction.id).toBe(input.id);
    expect(transaction.name).toBe(input.name);
    expect(transaction.value).toBe(input.value);
    expect(transaction.direction).toBe(input.direction);
    expect(transaction.createdAt).toBe(input.createdAt);
    expect(transaction.updatedAt).toBe(input.updatedAt);
    expect(transaction.when).toBe(input.when);
    expect(transaction.categories).toEqual(categories);
    expect(transaction.userId).toBe(input.userId);
  });

  test('associate user to transaction', () => {
    const newUserId = 'newUserId';
    transaction.associateUser(newUserId);
    expect(transaction.userId).toBe(newUserId);
  });

  test('transaction instance with value equal 0', () => {
    transaction = new Transaction(input.id, input.name, 0, input.direction, input.when, input.createdAt, input.updatedAt);
    expect(transaction.value).toBe(0);
  });

  test('transaction instance without category', () => {
    transaction = new Transaction(input.id, input.name, 0, input.direction, input.when, input.createdAt, input.updatedAt);
    expect(transaction.categories).toHaveLength(0);
  });
});

describe('fail', () => {
  test('value less than 0', () => {
    expect(() => new Transaction(input.id, input.name, -1, input.direction, input.when, input.createdAt, input.updatedAt))
      .toThrow('value must be greater or equal 0');
  });

  test('value less than 0', () => {
    expect(() => new Transaction(input.id, input.name, input.value, input.direction, new Date('2030-01-01'), input.createdAt, input.updatedAt))
      .toThrow('when date must be before now');
  });
});
