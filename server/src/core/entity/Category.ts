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
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get userId() {
    return this._userId;
  }

  associateUser(id: string) {
    this._userId = id;
  }
}
