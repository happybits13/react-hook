import React, {useState} from 'react';

// Global var to all that consume. Use import { AuthContext } to import this
export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
});

const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loginHandler = () => {
        setIsAuthenticated(true);
    }

    return(
        // Provider is a created from React.createContext 
        <AuthContext.Provider value={{login: loginHandler, isAuth: isAuthenticated}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;