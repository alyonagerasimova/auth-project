import convict from 'convict';

export default convict({
    env: {
        default: 'dev',
        env: 'NODE_ENV',
    },
    http: {
        port: {
            doc: 'The port to listen on',
            default: 3001,
            env: 'PORT',
        },
        host: {
            default: 'http://localhost',
            env: 'HOST',
        },
    },
    authentication: {
        github: {
            clientID: {
                doc: 'The Client ID from Github to use for authentication',
                default: '',
                env: 'GITHUB_CLIENT_ID',
            },
            clientSecret: {
                doc: 'The Client Secret from Github to use for authentication',
                default: '',
                env: 'GITHUB_SECRET',
            },
            scope: {
                default: [],
            },
        },
        token: {
            secret: {
                doc: 'The signing key for the JWT',
                default: 'mySuperSecretKey',
                env: 'JWT_SECRET',
            },
            issuer: {
                doc: 'The issuer for the JWT',
                default: '',
            },
            audience: {
                doc: 'The audience for the JWT',
                default: '',
            },
            expiresIn: {
                doc: 'expressed in seconds or a string describing a time span zeit/ms.',
                default: '24h',
                env: 'JWT_EXPIRES_IN',
            },
        },
        refreshToken: {
            expiresIn: {
                doc: 'expressed in seconds or a string describing a time span zeit/ms.',
                default: '24h',
                env: 'REFRESH_JWT_EXPIRES_IN',
            },
        },
    },
}).validate();