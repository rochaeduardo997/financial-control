import IUserRepository from '../../repository/UserRepository.interface';
import IJWT from "../../../infra/jwt/jwt.interface";

type TInput = { login: string; password: string; };

type TOutput = { token: string };

class LoginHandler {
  constructor(private uRepository: IUserRepository, private jwt: IJWT){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const user = await this.uRepository.login(input);
      const toEncode = {
        id:       user.id,
        email:    user.email,
        username: user.username,
        status:   user.status!
      };
      return { token: this.jwt.sign(toEncode) };
    }catch(err: any){
      throw new Error(err?.message);
    }
  }
}

export default LoginHandler;