export default class Category {
  private _id:          string;
  private _name:        string;
  private _description: string;

  constructor(id: string, name: string, description: string){
    this._id          = id;
    this._name        = name
    this._description = description
  }

  get id()          { return this._id; }
  get name()        { return this._name; }
  get description() { return this._description; }
}
