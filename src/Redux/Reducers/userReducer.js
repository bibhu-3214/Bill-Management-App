const userInitialState = { isLoggedIn: false, user: {} };

const userReducer = (state = userInitialState, action) => {
   switch (action.payload) {
      case 'LOGIN': {
         return { ...state, isLoggedIn: true };
      }
      case 'USER_INFORMATION': {
         return { ...state, user: action.payload };
      }
      default:
         return { ...state };
   }
};

export default userReducer;
