export default class User {
  private _id:        string;
  private _name:      string;
  private _username:  string;
  private _email:     string;
  private _password:  string;
  private _status:    boolean;
  private _role:      UserRole;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id:        string, 
    name:      string, 
    username:  string, 
    email:     string, 
    password:  string, 
    status:    boolean = true, 
    role:      UserRole, 
    createdAt: Date, 
    updatedAt: Date
  ){
    this._id        = id;
    this._name      = name;
    this._username  = username;
    this._email     = email;
    this._password  = password;
    this._status    = status;
    this._role      = role;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.isValid();
  }

  get id() { return this._id; }
  get name() { return this._name; }
  set name(x: string) {
    this._name = x;
    this.isValid();
  }
  get username() { return this._username; }
  set username(x: string) {
    this._username= x;
    this.isValid();
  }
  get email() { return this._email; }
  set email(x: string) {
    this._email= x;
    this.isValid();
  }
  get password() { return this._password; }
  set password(x: string) {
    this._password = x;
    this.isValid();
  }
  get status() { return this._status; }
  set status(x: boolean) {
    this._status = x;
    this.isValid();
  }
  get role() { return this._role; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  private isValid() {
    const isEmailValid = this.email.includes('@');
    if(!isEmailValid) throw new Error('invalid email format');
  }
}

export enum UserRole { ADMIN = 'admin', USER = 'user' }
