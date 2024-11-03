import Transaction, {
  TransactionDirection,
} from "../../../src/core/entity/Transaction";
import Category from "../../../src/core/entity/Category";
import Budget


 ,
 from "../../../src/core/entity/Budget";

let budget: Budget;
const tr1 = new Transaction(
  "id1",
  "name1",
  10.5,
  TransactionDirection.IN,
  new Date("2022-05-05T00:00:00"),
  new Date("2022-05-05T00:00:00"),
  new Date("2022-05-05T00:00:00"),
);
const tr2 = new Transaction(
  "id2",
  "name2",
  11.5,
  TransactionDirection.IN,
  new Date("2022-05-05T00:00:00"),
  new Date("2022-05-05T00:00:00"),
  new Date("2022-05-05T00:00:00"),
);
const input = { start: tr1.when, end: tr2.when };

beforeEach(() => (budget = new Budget(input.start, input.end)));

describe("success", () => {
  test("validate budget instance", () => {
    expect(budget.start).toBe(input.start);
    expect(budget.end).toBe(input.end);
    expect(budget.transactions).toHaveLength(0);
  });

  test("add transactions to budget between period", () => {
    budget.addTransactions([tr1, tr2]);
    expect(budget.transactions).toEqual([tr1, tr2]);
  });

  test("add equal transaction and doesnt return equal", () => {
    budget.addTransactions([tr1, tr1]);
    expect(budget.transactions).toEqual([tr1]);
  });

  test("validate addTransactions withtout parameter, stay with previous set list", () => {
    budget.addTransactions([tr1]);
    budget.addTransactions();
    expect(budget.transactions).toEqual([tr1]);
  });
});
