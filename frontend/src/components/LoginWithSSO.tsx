import React from 'react';
import {SERVER_URI, supportedSocialLoginTypes} from "../config/config";
import {openCenteredPopup} from "../services/nativePopup";
import {Box, Button, createStyles, makeStyles, Theme, Typography} from "@mui/material";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        loginWithText: {
            marginBottom: theme.spacing(4),
        },
        socialLoginButton: {
            textTransform: 'none',
            marginTop: 10,
        },
    }),
);

export default function LoginWithSSO() {
    const { loginWithText, socialLoginButton } = useStyles();

    const handleSocialLoginSubmit = async (provider: string) => {
        openCenteredPopup(`${SERVER_URI}/api/auth/${provider.toLowerCase()}`, `login with ${provider}`, 500, 500);
    };

    return (
        <Box mt={2} width={'100%'}>
            <Typography className={loginWithText} variant="caption" color="textSecondary" align="center">
                Or login with
            </Typography>
            {supportedSocialLoginTypes.map(({ name, icon: Icon }) => (
                <Button
                    key={name}
                    startIcon={<Icon />}
                    className={socialLoginButton}
                    variant={'outlined'}
                    color={'primary'}
                    onClick={() => handleSocialLoginSubmit(name)}
                    fullWidth
                >
                    {`Login with ${name}`}
                </Button>
            ))}
        </Box>
    );
}