import React, { useEffect } from 'react';

export const SocialAuthCallback = () => {
    useEffect(() => {
        setTimeout(() => {
            window.opener.authenticateCallback();
            window.close();
        }, 1000);
    });

    return <div>Authenticated successfully! you are being redirected...</div>;
};