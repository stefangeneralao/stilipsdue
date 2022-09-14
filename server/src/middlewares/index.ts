const jwks = require('jwks-rsa');
import { expressjwt } from 'express-jwt';
import dotenv from 'dotenv';
dotenv.config();

const issuer = process.env.ISSUER_BASE_URL;

console.log({ issuer });

export const checkJwt = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://stefangeneralao.eu.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://api.test',
  issuer: 'https://stefangeneralao.eu.auth0.com/',
  algorithms: ['RS256'],
});
