import Category from './Category';

export default class Transaction {
  private _id:        string;
  private _name:      string;
  private _value:     number;
  private _direction: TransactionDirection;
  private _when:      Date;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _category?: Category;
  private _userId?:   string;

  constructor(id: string, name: string, value: number, direction: TransactionDirection, when: Date, createdAt: Date, updatedAt: Date, category?: Category, userId?: string){
    this._id        = id;
    this._name      = name;
    this._value     = value;
    this._direction = direction;
    this._when      = when;
    this._category  = category;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._userId    = userId;
    
    this.isValid();
  }

  get id()        { return this._id; }
  get name()      { return this._name; }
  get value()     { return this._value; }
  get direction() { return this._direction; }
  get when()      { return this._when; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
  get category()  { return this._category; }
  get userId()    { return this._userId; }

  associateUser(id: string) { this._userId = id; }

  private isValid(){
    const valueLessThan0 = this.value < 0;
    if(valueLessThan0) throw new Error('value must be greater or equal 0');

    const whenIsntBeforeNow = (new Date()).getTime() < this.when.getTime();
    if(whenIsntBeforeNow) throw new Error('when date must be before now');
  }
}

export enum TransactionDirection { IN = 'in', OUT = 'out' };
