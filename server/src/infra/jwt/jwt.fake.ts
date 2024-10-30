import IJWT from "./jwt.interface";

class JWTFake implements IJWT {
  sign(toEncode: any): string { return 'token'; }
  verify(encoded: any): any   { return { id: 'id', status: true }; }
}

export default JWTFake;