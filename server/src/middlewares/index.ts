import jwksRsa, { GetVerificationKey } from 'jwks-rsa';
import { expressjwt } from 'express-jwt';

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://stefangeneralao.eu.auth0.com/.well-known/jwks.json',
  }) as GetVerificationKey,
  audience: 'https://api.test',
  issuer: 'https://stefangeneralao.eu.auth0.com/',
  algorithms: ['RS256'],
});
