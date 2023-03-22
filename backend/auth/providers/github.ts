import { Strategy as GithubStrategy } from 'passport-github2';
import { getConfigByProviderName, processUserFromSSO } from '../index';
import passport from 'passport';
import { VerifiedCallback } from 'passport-jwt';
import { Request } from 'express';

const providerName = 'github';
const passportConfig = getConfigByProviderName(providerName);

if (passportConfig.clientID) {
    passport.use(
        new GithubStrategy(
            { ...passportConfig, passReqToCallback: true },
            (req: Request, accessToken: string, refreshToken: string, profile: any, verified: VerifiedCallback) => {
                processUserFromSSO(req, profile, providerName, verified);
            },
        ),
    );
}