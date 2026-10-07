import { LOGIN, LOGOUT, USER_INFORMATION } from '../actionTypes';
import localData from '../../data/localData';

const userInitialState = { isLoggedIn: localData.hasActiveSession(), userDetails: {} };

const userReducer = (state = userInitialState, action) => {
    switch (action.type) {
        case LOGIN: {
            return { ...state, isLoggedIn: true };
        }
        case LOGOUT: {
            return { ...userInitialState, isLoggedIn: false };
        }
        case USER_INFORMATION: {
            return { ...state, userDetails: action.payload };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;
