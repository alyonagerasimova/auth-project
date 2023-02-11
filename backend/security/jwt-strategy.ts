import {Strategy as JwtStrategy, VerifiedCallback} from 'passport-jwt';
import passport from 'passport';
import {Request} from 'express';
import {decrypt} from '../utils/encrypt-util';
import {getTokenType, TokenType} from '../utils/token-util';
const User = require("../models/User");

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: (req: Request) => {
                try {
                    if (!req.headers.authorization) {
                        throw new Error('token was not provided, authorization header is empty');
                    }

                    const tokenFromHeader = req.headers.authorization.replace('Bearer ', '').trim();
                    const decryptedToken = decrypt(tokenFromHeader);
                    const tokenType = getTokenType(decryptedToken);

                    if (tokenType !== TokenType.ACCESS_TOKEN) {
                        throw new Error('wrong token type provided');
                    }

                    return decryptedToken;
                } catch (e) {
                    console.error('Token is not valid', e.message);
                    return null;
                }
            },
            secretOrKey: 'authentication.token.secret',
            issuer: 'authentication.token.issuer',
            audience: 'authentication.token.audience',
            passReqToCallback: true,
        },
        (req: Request, payload: any, done: VerifiedCallback) => {
            User.findById(payload.sub, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                req.currentUser = user?.toObject();
                return !user ? done(null, false) : done(null, user);
            });
        },
    )
);