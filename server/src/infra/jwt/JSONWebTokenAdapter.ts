import IJWT from "./jwt.interface";
import jwt from 'jsonwebtoken';

class JSONWebTokenAdapter implements IJWT {
  private JWT_SECRET = process.env.JWT_SECRET as string;

  sign(toEncode: any): string { return jwt.sign(toEncode, this.JWT_SECRET); }
  verify(encoded: any): any   { return jwt.verify(encoded, this.JWT_SECRET); }
}

export default JSONWebTokenAdapter;