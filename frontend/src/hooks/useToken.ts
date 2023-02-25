import {useCallback, useEffect, useRef} from "react";
import {useTokenExpiration} from "./useTokenExpiration";
import Axios from 'axios';
import {configure} from 'axios-hooks';
import {TokenResponse} from "../config/types";
import {BASE_URL} from "../config/config";

export const axios = Axios.create({
    baseURL: BASE_URL,
});

export function useToken(onTokenInvalid: Function, onRefreshRequired: Function) {
    const accessToken = useRef<string>();
    const {clearAutomaticTokenRefresh, setTokenExpiration} = useTokenExpiration(onRefreshRequired);

    const setToken = useCallback(
        ({token_expiration, access_token}: TokenResponse) => {
            accessToken.current = access_token;
            const expirationDate = new Date(token_expiration);
            setTokenExpiration(expirationDate);
        },
        [setTokenExpiration],
    );

    const isAuthenticated = useCallback(() => {
        return !!accessToken.current;
    }, []);

    const clearToken = useCallback(
        (shouldClearCookie = true) => {
            const clearRefreshTokenCookie = shouldClearCookie ? axios.get('logout') : Promise.resolve();

            return clearRefreshTokenCookie.finally(() => {
                accessToken.current = '';
                clearAutomaticTokenRefresh();
            });
        },
        [clearAutomaticTokenRefresh],
    );

    useEffect(() => {
        axios.interceptors.request.use(
            (config) => {
                config.headers!.Authorization = `Bearer ${accessToken.current}`;
                return config;
            },
        );

        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response.status === 401 && accessToken.current) {
                    clearToken();
                    onTokenInvalid();
                }
                return Promise.reject(error);
            },
        );

        configure({axios});
    }, [clearToken, onTokenInvalid]);

    return {
        clearToken,
        setToken,
        isAuthenticated,
    };
}