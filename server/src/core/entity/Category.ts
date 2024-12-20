export default class Category {
  private _id: string;
  private _name: string;
  private _description?: string;
  private _userId?: string;

  constructor(id: string, name: string, description?: string, userId?: string) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._userId = userId;

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
    this.isValid();
  }
  get description(): string | undefined {
    return this._description;
  }
  set description(x: string) {
    this._description = x;
    this.isValid();
  }
  get userId() {
    return this._userId;
  }

  associateUser(id: string) {
    this._userId = id;
  }

  private isValid() {
    if (!this.name) throw new Error("name must be provided");
  }
}
