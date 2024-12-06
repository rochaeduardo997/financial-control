import Category from "./Category";

export default class Transaction {
  private _id: string;
  private _name: string;
  private _value: number;
  private _direction: TransactionDirection;
  private _when: Date;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _categories: Set<Category>;
  private _userId?: string;
  private _description?: string;
  private _currency?: string;
  private _quantity?: number;

  constructor(
    id: string,
    name: string,
    value: number,
    direction: TransactionDirection,
    when: Date,
    createdAt?: Date,
    updatedAt?: Date,
    userId?: string,
    description?: string,
    currency: TransactionCurrency = TransactionCurrency.BRL,
    quantity: number = 1,
  ) {
    this._id = id;
    this._name = name;
    this._value = value;
    this._direction = direction;
    this._when = when;
    this._categories = new Set<Category>();
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._userId = userId;
    this._description = description;
    this._currency = currency;
    this._quantity = quantity;

    this.isValid();
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  set name(x: string) {
    this._name = x;
  }
  get value() {
    return this._value;
  }
  set value(x: number) {
    this._value = x;
  }
  get direction() {
    return this._direction;
  }
  set direction(x: TransactionDirection) {
    this._direction = x;
  }
  get when() {
    return new Date(this._when);
  }
  set when(x: Date) {
    this._when = x;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get categories() {
    return Array.from(this._categories);
  }
  get userId() {
    return this._userId;
  }
  get description() {
    return this._description || "";
  }
  set description(x: string) {
    this._description = x;
  }
  get currency() {
    return this._currency || "";
  }
  set currency(x: string) {
    this._currency = x;
  }
  get quantity() {
    return this._quantity || 1;
  }
  set quantity(x: number) {
    this._quantity = x;
  }

  associateUser(id: string) {
    this._userId = id;
  }
  associateCategory(c: Category) {
    this._categories.add(c);
  }
  cleanupCategories() {
    this._categories.clear();
  }

  private isValid() {
    if (!this.name) throw new Error("name must be provided");
    if (!this.value) throw new Error("value must be provided");
    if (!this.direction) throw new Error("direction must be provided");
    const validDirectionValue = /^in$|^out$/.test(this.direction);
    if (!validDirectionValue) throw new Error("direction must be in/out");

    const valueLessThan0 = this.value < 0;
    if (valueLessThan0) throw new Error("value must be greater or equal 0");
  }
}

export enum TransactionDirection {
  IN = "in",
  OUT = "out",
}

export enum TransactionCurrency {
  BRL = "R$",
  USD = "$",
  EUR = "£",
}
