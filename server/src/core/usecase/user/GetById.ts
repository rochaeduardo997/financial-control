import IUserRepository from '../../repository/UserRepository.interface';

type TInput = { id: string; };

type TOutput = {
  id:       string;
  name:     string;
  username: string;
  email:    string;
};

class GetByIdHandler {
  constructor(private uRepository: IUserRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const result = await this.uRepository.getBy(input.id);
      return {
        id:       result.id,
        name:     result.name,
        username: result.username,
        email:    result.email
      };
    }catch(err: any){
      throw new Error(err?.message);
    }
  }
}

export default GetByIdHandler;