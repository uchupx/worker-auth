
import jwt, { type SignOptions } from 'jsonwebtoken';

export class JWT {
  static JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || '';
  static JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || '';
  static JWT_SECRET = process.env.JWT_SECRET || null;
  static TOKEN_TIME = process.env.TOKEN_TIME || '1h';

  constructor(publicKey: string, privateKey: string, secret: string | null = null) {
    JWT.JWT_PUBLIC_KEY = publicKey;
    JWT.JWT_PRIVATE_KEY = privateKey;
    JWT.JWT_SECRET = secret;
  }

  encodeToken = (object = {}) => {
    const options = {
      issuer: 'My App',
      algorithm: 'RS256',
      expiresIn: JWT.TOKEN_TIME,
    } as SignOptions;

    const token = jwt.sign(
      object,
      { key: JWT.JWT_PRIVATE_KEY.replace(/\\n/gm, '\n') },
      options,
    );

    return token;
  }

  hash = ( object: string | object ) => {
    const options = {
      algorithm: 'RS256',
    } as SignOptions;

    const token = jwt.sign(
      object,
      { key: JWT.JWT_PRIVATE_KEY.replace(/\\n/gm, '\n') },
      options,
    );

    return token;
  }

  verifyHash = (sentToken: string) => {
    const options = {
      algorithm: 'RS256',
    } as SignOptions;

    const tokenVerify = jwt.verify(
      sentToken,
      JWT.JWT_PUBLIC_KEY.replace(/\\n/gm, '\n'),
      options,
      (err, decode) => {
        if (err) {
          return true;
        }

        return false;
      },
    );

    return tokenVerify;
  }

  verifyToken = (sentToken: string) => {
    const options = {
      issuer: 'My App',
      algorithms: ['RS256'],
      maxAge: JWT.TOKEN_TIME,
    } as SignOptions;

    const userToken = jwt.verify(
      sentToken,
      JWT.JWT_PUBLIC_KEY.replace(/\\n/gm, '\n'),
      options,
      (err, decode) => {
        if (err) {
          return { tokenExp: true, error: err };
        }

        return { tokenExp: false, decode };
      },
    );

    return userToken;
  }
}

