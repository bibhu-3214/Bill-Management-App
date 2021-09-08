const userInitialState = { isLoggedIn: localStorage.getItem('token') ? true : false, userDetails: {} };

const userReducer = (state = userInitialState, action) => {
    switch (action.type) {
        case 'LOGIN': {
            return { ...state, isLoggedIn: true };
        }
        case 'USER_INFORMATION': {
            return { ...state, userDetails: action.payload };
        }
        default: {
            return { ...state };
        }
    }
};

export default userReducer;
