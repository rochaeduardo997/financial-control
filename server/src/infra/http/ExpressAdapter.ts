import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ICache from "../cache/cache.interface";
import IJWT from "../jwt/jwt.interface";
import IHttp, {TMethods} from "./HTTP.interface";

type TReqUser = {
  id:       string;
  username: string;
  fullname: string;
  email:    string;
  status:   boolean;
  token:    string;
};

declare global {
  namespace Express {
    export interface Request { user?: TReqUser }
  }
}

class ExpressAdapter implements IHttp {
  public app;
  private route;

  constructor(private cache: ICache, private jwt: IJWT){
    this.app = express()
      .use(cors())
      .use(express.json())
      .use(helmet())
      .use(express.urlencoded({ extended: true })) 
      .use(this.middleware.bind(this));

    this.route = express.Router();
  }

  private async middleware(req: Request, res: Response, next: NextFunction){
    if(/login/i.test(req.url)) return next();
    try{
      const token = req.headers.authorization?.split(' ') || [];
      if(!token?.[1]) throw new Error();
      const tokenVerified = this.jwt.verify(token[1]) as TReqUser;
      if(!tokenVerified.status) throw new Error('disabled user');
      await this.validateTokenBy(tokenVerified.id, token[1]);
      req.user = { ...tokenVerified, token: token[1] };
      return next();
    }catch(err: any){
      return res.status(401).json({ status: false, msg: err.message || 'invalid token' });
    }
  }

  private async validateTokenBy(userId: string, token: string): Promise<void>{
    const sessions = await this.cache.listGet(`session:${userId}`);
    if(!sessions?.includes(token)) throw new Error();
    return;
  }

  addRoute(method: TMethods, url: string, callback: Function): void {
    this.route[method](url, async (req: any, res: any) => {
      try{
        const { statusCode, result } = await callback(req, res);
        return res.status(statusCode).json({ result });
      }catch(err: any){
        return res.status(400).json({ status: false, msg: err?.message });
      }
    });
  }

  init(): void {
    this.app.use('/api/v1', this.route);
  }

  listen(): void {
    const port = process.env.API_PORT || 3000;
    this.app.listen(port);
    console.log(`server running on ${port}`)
  }
}

export default ExpressAdapter;
