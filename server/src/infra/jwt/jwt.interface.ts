interface IJWT {
  sign(toEncode: any): string;
  verify(encoded: any): any;
}

export default IJWT;