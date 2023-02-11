import passport from 'passport';

export const requireAuth = passport.authenticate('jwt', {
    userProperty: 'currentUser',
    session: false
})