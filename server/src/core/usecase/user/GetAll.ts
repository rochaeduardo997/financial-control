import IUserRepository from '../../repository/UserRepository.interface';

type TOutput = {
  id:       string;
  name:     string;
  username: string;
  email:    string;
};

class GetAllHandler {
  constructor(private uRepository: IUserRepository){}

  async execute(): Promise<TOutput[]>{
    try{
      const result: TOutput[] = [];
      const users = await this.uRepository.getAll();
      for(const u of users) 
        result.push({
          id:       u.id,
          name:     u.name,
          username: u.username,
          email:    u.email
        });
      return result;
    }catch(err: any){
      throw new Error(err?.message);
    }
  }
}

export default GetAllHandler;