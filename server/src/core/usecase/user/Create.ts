import { createHash } from 'crypto';
import IUserRepository from '../../repository/UserRepository.interface';
import User, { UserRole } from '../../entity/User';

type TInput = { 
  name:      string;
  username:  string;
  email:     string;
  password:  string;
};

type TOutput = {
  id:       string;
  name:     string;
  username: string;
  email:    string;
};

class CreateHandler {
  constructor(private uRepository: IUserRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      console.log(input);
      if(!input.password) throw new Error('password must be provided');
      const userId = crypto.randomUUID();
      const password = createHash('sha512')
        .update(input.password)
        .digest('hex');
      const user = new User(
        userId,
        input.name,
        input.username,
        input.email,
        password,
        false,
        UserRole.USER,
        new Date(),
        new Date()
      );
      const createdUser = await this.uRepository.create(user);
      return {
        id:       createdUser.id,
        name:     createdUser.name,
        username: createdUser.username,
        email:    createdUser.email
      };
    }catch(err: any){
      throw new Error(err?.message);
    }
  }
}

export default CreateHandler;
