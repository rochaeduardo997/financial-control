import Transaction from './Transaction';

export default class Budget {
  private _start:        Date;
  private _end:          Date;
  private _transactions: Set<Transaction>;

  constructor(start: Date, end: Date){
    this._start        = start;
    this._end          = end;
    this._transactions = new Set<Transaction>();
  }

  get start()        { return this._start; }
  get end()          { return this._end; }
  get transactions() { return Array.from(this._transactions); }

  addTransactions(transactions: Transaction[] = []): void {
    if(!transactions.length) return;
    this._transactions.clear();
    transactions.forEach(tr => this._transactions.add(tr));
  }
}

