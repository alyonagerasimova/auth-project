import React, {ComponentType, FC} from 'react';
import {BrowserRouter as Router, Navigate, Route} from 'react-router-dom';
import {AuthContainer} from "../containers/AuthContainer";

interface ProtectedRouteProps {
    component: ComponentType<any>;
    path: string
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({component: Component, path = ''}) => {
    const {user} = AuthContainer.useContainer();
    return (
        <Route
            path={path}
            // render={(props) =>
            //     user ? (
            //         <Component {...props} />
            //     ) : (
            //         <Navigate
            //             to={'/login'}
            //             state={{from: props.location}}
            //         />
            //     )
            // }
        />
    );
}