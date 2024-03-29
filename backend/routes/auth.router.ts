import express, { Request, Response } from 'express';
import { requireAuth } from '../security/auth';
import {generateAccessToken, generateRefreshToken, parseTokenAndGetUserId} from '../utils/token-util';
import config from "../config/config";
import passport from 'passport';

const router = express.Router();

async function findUserById(userId) {
//TODO
}

const generateTokensAndAuthenticateUser = async (res, userId) => {

    const user = await findUserById(userId);
    const { token: access_token, expiration: token_expiration } = await generateAccessToken(userId);
    const { token: refreshToken } = generateRefreshToken(userId);
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.status(200).json({ access_token, token_expiration, user });
};

// router.post('/register', (req, res) => {
//     try {
//         const { email } = req.body;
//         const doesEmailExist = await fieldExists('email', email);
//
//         if (!doesEmailExist) {
//             const user = await registerUser(req.body);
//             generateTokensAndAuthenticateUser(res, user._id);
//         }
//     } catch (error) {
//         handleError(res, error);
//     }
// });
//
// router.get('/refresh-token', (req, res) => {
//     try {
//         const tokenEncrypted = req.cookies.refresh_token;
//         const userId = await parseTokenAndGetUserId(tokenEncrypted);
//         generateTokensAndAuthenticateUser(res, userId);
//     } catch (error) {
//         handleError(res, error);
//     }
// });
//
// router.get('/logout', requireAuth, (req, res) => {
//     res.cookie('refresh_token', '', { httpOnly: true });
//     res.status(200).end();
// });
//
// router.post('/login', async (req, res) => {
//     try {
//         const { email, passport } = req.body;
//         const user = await findUser(data.email);
//         await checkPassword(password, user);
//         generateTokensAndAuthenticateUser(res, user._id);
//     } catch (error) {
//         handleError(res, error);
//     }
// });

export const generateUserTokenAndRedirect = async (req: Request, res: Response) => {
    const successRedirect = `${process.env.FRONTEND_URL}/authentication/redirect`;
    const { token } = generateRefreshToken(req.currentUser?._id.toString());
    res.cookie('refresh_token', token, { httpOnly: true });
    res.redirect(successRedirect);
};

Object.keys(config.get('authentication') || {}).forEach((providerName) => {
    const failureRedirect = `${process.env.FRONTEND_URL}"`;
    const providerAuthMiddleware = passport.authenticate(providerName, {
        session: false,
        userProperty: 'currentUser',
        failureRedirect,
    });
    router.get(`/auth/${providerName}`, providerAuthMiddleware);
    router.get(`/auth/${providerName}/callback`, providerAuthMiddleware, generateUserTokenAndRedirect);
});

export default router;