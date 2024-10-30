import IUserRepository from '../../repository/UserRepository.interface';
import IJWT from "../../../infra/jwt/jwt.interface";
import ICache from "../../../infra/cache/cache.interface";

type TInput = { login: string; password: string; };

type TOutput = { token: string };

class LoginHandler {
  constructor(private uRepository: IUserRepository, private jwt: IJWT, private cache: ICache){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const user = await this.uRepository.login(input);
      const toEncode = {
        id:       user.id,
        email:    user.email,
        username: user.username,
        status:   user.status!
      };
      const token = this.jwt.sign(toEncode);
      await this.cache.listSet(`session:${user.id}`, token, 864e5);
      return { token };
    }catch(err: any){
      throw new Error(err?.message);
    }
  }
}

export default LoginHandler;