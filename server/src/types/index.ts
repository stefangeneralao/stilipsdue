import { Request } from 'express';

export interface GetUserAuthInfoRequest extends Request {
  auth?: {
    sub: string;
  };
}
