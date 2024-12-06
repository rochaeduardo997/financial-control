import Transaction, {
  TransactionCurrency,
  TransactionDirection,
} from "../../../src/core/entity/Transaction";
import Category from "../../../src/core/entity/Category";

let transaction: Transaction;
const categories = [new Category("id", "name", "description", "userId")];
const input = {
  id: "id",
  name: "name",
  value: 10.5,
  direction: TransactionDirection.IN,
  when: new Date("2022-05-04T00:00:00"),
  createdAt: new Date("2022-05-05T00:00:00"),
  updatedAt: new Date("2022-05-06T00:00:00"),
  userId: "userId",
  description: "description",
  currency: TransactionCurrency.EUR,
  quantity: 10,
};

beforeEach(() => {
  transaction = new Transaction(
    input.id,
    input.name,
    input.value,
    input.direction,
    input.when,
    input.createdAt,
    input.updatedAt,
    input.userId,
    input.description,
    input.currency,
    input.quantity,
  );
  for (const c of categories) transaction.associateCategory(c);
});

describe("success", () => {
  test("clear categories set", () => {
    transaction.cleanupCategories();
    expect(transaction.categories).toHaveLength(0);
  });

  test("update fields", () => {
    transaction.name = "new_name";
    transaction.value = 99.98;
    transaction.direction = TransactionDirection.OUT;
    transaction.when = new Date("2010-02-02");
    transaction.description = "updated_description";
    transaction.currency = TransactionCurrency.BRL;
    transaction.quantity = 1;
    expect(transaction.name).toBe("new_name");
    expect(transaction.value).toBe(99.98);
    expect(transaction.direction).toBe(TransactionDirection.OUT);
    expect(transaction.when).toEqual(new Date("2010-02-02"));
    expect(transaction.description).toBe("updated_description");
    expect(transaction.currency).toBe(TransactionCurrency.BRL);
    expect(transaction.quantity).toBe(1);
  });

  test("validate transaction instance", () => {
    expect(transaction.id).toBe(input.id);
    expect(transaction.name).toBe(input.name);
    expect(transaction.value).toBe(input.value);
    expect(transaction.direction).toBe(input.direction);
    expect(transaction.createdAt).toBe(input.createdAt);
    expect(transaction.updatedAt).toBe(input.updatedAt);
    expect(transaction.when).toEqual(input.when);
    expect(transaction.categories).toEqual(categories);
    expect(transaction.userId).toBe(input.userId);
    expect(transaction.description).toBe(input.description);
    expect(transaction.currency).toBe(input.currency);
    expect(transaction.quantity).toBe(input.quantity);
  });

  test("associate user to transaction", () => {
    const newUserId = "newUserId";
    transaction.associateUser(newUserId);
    expect(transaction.userId).toBe(newUserId);
  });

  test("transaction instance without category", () => {
    transaction = new Transaction(
      input.id,
      input.name,
      10,
      input.direction,
      input.when,
      input.createdAt,
      input.updatedAt,
    );
    expect(transaction.categories).toHaveLength(0);
  });
});

describe("fail", () => {
  test("transaction instance without name", () => {
    expect(
      () =>
        new Transaction(
          input.id,
          "",
          10,
          input.direction,
          input.when,
          input.createdAt,
          input.updatedAt,
        ),
    ).toThrow("name must be provided");
  });

  test("transaction instance without value", () => {
    expect(
      () =>
        new Transaction(
          input.id,
          input.name,
          0,
          input.direction,
          input.when,
          input.createdAt,
          input.updatedAt,
        ),
    ).toThrow("value must be provided");
  });
});
