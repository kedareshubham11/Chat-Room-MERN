import { Button } from '@material-ui/core';
import React from 'react';
import "./Login.css";
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';

function Login() {
    const [{}, dispatch] = useStateValue();

    const signIn = () => {
        dispatch({
            type: actionTypes.SET_USER,
            user: 'true',
        });

        
    }
    
    return (
        <div className="login">
            <div className="login__container">
            <img 
                src="https://icon-library.com/images/chat-room-icon/chat-room-icon-7.jpg"
                alt=""
                />

                <div className="login__text">
                    <h1>Sign in to Chat-Room</h1>

                </div>

                <Button onClick={signIn}>
                    Sign In
                </Button>
        </div>
        </div>
    )
}

export default Login
