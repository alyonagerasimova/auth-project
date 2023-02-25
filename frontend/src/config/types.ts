export interface TokenResponse {
    access_token: string;
    token_expiration: string;
}

export interface UserAndTokenResponse extends TokenResponse {
    user: User;
}

export interface UserBase {
    name: string;
    email: string;
    password: string;
}

export interface User extends UserBase {
    _id: string;
    role: 'user' | 'admin';
}