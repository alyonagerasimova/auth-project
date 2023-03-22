import {useCallback, useEffect, useState} from "react";
import {axios, useToken} from "../hooks/useToken";
import { createContainer } from 'unstated-next';
import {User, UserAndTokenResponse, UserBase} from "../config/types";
// @ts-ignore
import { useHistory } from 'react-router-dom';
import {AuthEvents} from "../services/AuthEvents";

function useAuth() {
    const history = useHistory();
    const [user, setUser] = useState<User | null>(null);
    const refreshToken = useCallback(refresh, []);

    const onTokenInvalid = useCallback(() => setUser(null), []);
    const {setToken, clearToken, isAuthenticated} = useToken(onTokenInvalid, refreshToken);

    useEffect(() => {
        refreshToken().then(r => r);
    }, [refreshToken]);

    useEffect(() => {
        window.addEventListener('storage', async (event: WindowEventMap['storage']) => {
            if(event.key === AuthEvents.LOGOUT && isAuthenticated()){
                await clearToken(false);
                setUser(null);
            }else if(event.key === AuthEvents.LOGIN){
                await refreshToken();
            }
        });
        window.authenticateCallback = async function () { //window.authenticateCallback
            await refreshToken();
            history.push('/');
        };
    }, [clearToken,history, isAuthenticated, refreshToken])

    const logout = useCallback(() => {
        clearToken().finally(() => {
            setUser(null);
            history.push("/");
            window.localStorage.setItem(AuthEvents.LOGOUT, new Date().toISOString());
        });
    },[history, clearToken]);

    const register = useCallback(
        async (userToRegister: UserBase) => {
            const {
                data: { user, ...rest },
            } = await axios.post<UserAndTokenResponse>('register', userToRegister);
            setUser(user);
            setToken(rest);
        },
        [setToken],
    );

    const login = useCallback(
        async (email: string, password: string) => {
            const {
                data: { user, ...rest },
            } = await axios.post<UserAndTokenResponse>('login', {
                email,
                password,
            });
            setUser(user);
            setToken(rest);
            window.localStorage.setItem(AuthEvents.LOGIN, new Date().toISOString());
        },
        [setToken],
    );

    async function refresh() {
        const {
            data: {user, ...rest},
        } = await axios.get<UserAndTokenResponse>('refresh-token');
        setUser(user);
        setToken(rest);
    }

    return {
        user,
        setUser,
        register,
        login,
        logout,
        refreshToken
    }
}

export const AuthContainer = createContainer(useAuth);