import {VerifiedCallback} from 'passport-jwt';
import config from '../config/config';
import passport from 'passport';
import {Request} from 'express';
import {join} from 'path';
import * as fs from "fs";

export const init = () => {
    const providersPath = join(__dirname, 'providers');
    fs.readdirSync(providersPath).forEach((file) => {
        const authFile = removeExtensionFromFile(file);
        import(join(providersPath, authFile));
    });
};

export const requireAuth = passport.authenticate('jwt', {
    userProperty: 'currentUser',
    session: false,
});

export const getConfigByProviderName = (providerName: string) => {
    return {
        clientID: config.get(`authentication.${providerName}.clientID`),
        clientSecret: config.get(`authentication.${providerName}.clientSecret`),
        scope: config.get(`authentication.${providerName}.scope`),
        callbackURL: getAuthCallbackUrl(providerName),
    };
};

export const processUserFromSSO = (req: Request, profile: any, origin: string, done: VerifiedCallback) => {
    const {
        emails,
        name: {givenName, familyName},
        id,
    } = profile;

    UserModel.findOneAndUpdate(
        {origin, originId: id},
        {
            email: emails?.[0]?.value,
            firstName: givenName,
            lastName: familyName,
            origin,
            originId: id,
        },
        {upsert: true},
        (err, user) => {
            if (err) {
                return done(err);
            }
            req.currentUser = user as User;
            return done(null, user);
        },
    );
};

const getAuthCallbackUrl = (providerName: string) => {
    return `${config.get('http.host')}:${config.get('http.port')}/api/auth/${providerName}/callback`;
};