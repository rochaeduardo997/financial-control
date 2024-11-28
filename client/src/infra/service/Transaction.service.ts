import IHTTP from "../http/HTTP.interface";
import HTTP from "../http/HTTP.provider";
import Transaction from "../../../../server/src/core/entity/Transaction";

class TransactionService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL;

  private httpRequest: IHTTP;

  constructor() {
    this.httpRequest = HTTP;
  }

  //   async create(input: Transaction): Promise<Transaction> {
  //     try {
  //       const productsId: string[] = (input.products || []).map(
  //         (p) => p.productId,
  //       );
  //       const body = {
  //         name: input.name,
  //         email: input.email,
  //         token: input.token,
  //         cpfcnpj: input.cpfcnpj,
  //         productsId,
  //       };
  //       const { data } = await this.httpRequest.post(
  //         `${this.API_URL}/transactions`,
  //         body,
  //       );
  //       return new Transaction({ ...data.result });
  //     } catch (err: any) {
  //       console.error(err);
  //       throw new Error();
  //     }
  //   }

  async findAllCount(): Promise<number> {
    try {
      const { data } = await this.httpRequest.get(
        `${this.API_URL}/transactions/count/all`,
      );
      return data.result;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }

  async findAll(page: number = 0, limit: number = 25): Promise<Transaction[]> {
    try {
      const { data } = await this.httpRequest.get(
        `${this.API_URL}/transactions/all?page=${page}&limit=${limit}`,
      );
      const transactions: Transaction[] = [];
      for (const transaction of data.result)
        transactions.push(
          new Transaction(
            transaction.id,
            transaction.name,
            transaction.value,
            transaction.direction,
            transaction.when,
          ),
        );
      return transactions;
    } catch (err: any) {
      console.error(err);
      throw new Error();
    }
  }

  //   async findBy(id: string): Promise<Transaction> {
  //     try {
  //       const { data } = await this.httpRequest.get(
  //         `${this.API_URL}/transactions/${id}`,
  //       );
  //       const products: TransactionProduct[] = (data?.result?.products || []).map(
  //         (p: any) => new TransactionProduct({ id: p.id, productId: p.productId }),
  //       );
  //       const apiUser = new Transaction({ ...data.result });
  //       apiUser.changeProducts(products);
  //       return apiUser;
  //     } catch (err: any) {
  //       console.error(err);
  //       throw new Error();
  //     }
  //   }

  //   async updateBy(id: string, input: Transaction): Promise<Transaction> {
  //     try {
  //       const productsId: string[] = (input.products || []).map(
  //         (p) => p.productId,
  //       );
  //       const body = {
  //         name: input.name,
  //         email: input.email,
  //         token: input.token,
  //         productsId,
  //       };
  //       const { data } = await this.httpRequest.put(
  //         `${this.API_URL}/transactions/${id}`,
  //         body,
  //       );
  //       return new Transaction({ ...data.result });
  //     } catch (err: any) {
  //       console.error(err);
  //       throw new Error();
  //     }
  //   }

  //   async deleteBy(id: string): Promise<boolean> {
  //     try {
  //       const { data } = await this.httpRequest.delete(
  //         `${this.API_URL}/transactions/${id}`,
  //       );
  //       return data.result;
  //     } catch (err: any) {
  //       console.error(err);
  //       throw new Error();
  //     }
  //   }
}

export default TransactionService;
