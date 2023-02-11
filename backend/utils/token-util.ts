import {decode, sign, verify} from 'jsonwebtoken';
import {decrypt, encrypt} from "./encrypt-util";

export enum TokenType {
    ACCESS_TOKEN = 'access_token',
    REFRESH_TOKEN = 'refresh_token',
}

//exp (срок действия), sub (subject)
type JWT = { exp: number; type: TokenType; sub: string };

const generateToken = (userId: string, type: TokenType) => {
    const audience = 'authentication.token.audience'; //в config
    const issuer = 'authentication.token.issuer';
    const secret = 'authentication.token.secret';
    const expiresIn =
        type === TokenType.ACCESS_TOKEN
            ? 'authentication.token.expiresIn'
            : 'authentication.refreshToken.expiresIn';
    const token = sign({type}, secret, {
        expiresIn,
        audience,
        issuer,
        subject: userId
    });
    return {
        token: encrypt(token),
        expiration: (decode(token) as JWT).exp * 1000,
    };
}

export const generateAccessToken = (userId: string) => {
    return generateToken(userId, TokenType.ACCESS_TOKEN);
}

export const generateRefreshToken = (userId: string) => {
    return generateToken(userId, TokenType.REFRESH_TOKEN);
}

export const getTokenType = (token: string): TokenType => {
    return (verify(token, 'authentication.token.secret') as JWT).type;
}

export const parseTokenAndGetUserId = (token: string): string => {
    const decryptedToken = decrypt(token);
    const decoded = verify(decryptedToken, 'authentication.token.secret') as JWT;
    return decoded.sub || '';
}