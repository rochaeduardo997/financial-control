import ICache from "../../../infra/cache/cache.interface";

type TInput = { id: string, token: string };

class LogoutHandler {
	private JWT_SECRET = process.env.JWT_SECRET as string;

	constructor(private cache: ICache){}

	async execute(input: TInput): Promise<boolean>{
		try{
			return await this.cache.listDeleteBy(`session:${input.id}`, input.token);
		}catch(err: any){
			throw new Error(err.message);
		}
	}
}

export default LogoutHandler;