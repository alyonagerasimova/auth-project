import {useEffect, useRef, useState} from "react";

export function useTokenExpiration(onTokenRefreshRequired: Function){
    const clearAutomaticRefresh = useRef<number>();
    const [tokenExpiration, setTokenExpiration] = useState<Date>();
    useEffect(() => {
        if(tokenExpiration instanceof Date && !isNaN(tokenExpiration.valueOf())){
            const now = new Date();
            const triggerAfterMs = tokenExpiration.getTime() - now.getTime();
            clearAutomaticRefresh.current = window.setTimeout( async () => {
                onTokenRefreshRequired()
            }, triggerAfterMs)
        }
      return () => {
            window.clearTimeout(clearAutomaticRefresh.current);
      }
    }, [onTokenRefreshRequired, tokenExpiration]);

    const clearAutomaticTokenRefresh = () => {
        window.clearTimeout(clearAutomaticRefresh.current);
        setTokenExpiration(undefined);
    };

    return {
        clearAutomaticTokenRefresh,
        setTokenExpiration,
    };
}