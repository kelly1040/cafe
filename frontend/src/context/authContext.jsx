import { jwtDecode } from "jwt-decode";
import {createContext, useReducer} from 'react';

const initialState = {
    user: null
}

if (localStorage.getItem('token')) {
    const decodedToken = jwtDecode(localStorage.getItem('token'));
    // check to see if token expired
    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('tok en');
    } else {
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
});

function authReducer(state, action) {
    switch(action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        localStorage.setItem('token', userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        });
    }

    function logout() {
        localStorage.removeItem('token');
        dispatch({type: 'LOGOUT'});
    }

    return (
        <AuthContext.Provider value={{user: state.user, login, logout}} {...props} />
    )
}

export {AuthContext, AuthProvider};