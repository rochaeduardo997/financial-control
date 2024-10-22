export default class Transaction {
  private _id:        string;
  private _value:   number;
  private _direction: TransactionDirection;

  constructor(id: string, value: number, direction: TransactionDirection){
    this._id        = id;
    this._value   = value;
    this._direction = direction;
    
    this.isValid();
  }

  get id()        { return this._id; }
  get value()     { return this._value; }
  get direction() { return this._direction; }

  private isValid(){
    const valueLessThan0 = this.value < 0;
    if(valueLessThan0) throw new Error('value must be greater or equal 0');
  }
}

export enum TransactionDirection { IN = 'in', OUT = 'out' };
