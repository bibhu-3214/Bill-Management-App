const customersInitialState = [];

const customersReducer = (state = customersInitialState, action) => {
   switch (action.type) {
      case 'ADD_CUSTOMER': {
         return [...state, action.payload];
      }
      case 'GET_CUSTOMER': {
         return [...action.payload];
      }
      case 'REMOVE_CUSTOMER': {
         return state.filter((ele) => ele._id !== action.payload._id);
      }
      case 'EDIT_CUSTOMER': {
         return state.map((ele) => {
            if (ele._id === action.payload._id) {
               return { ...action.payload };
            } else {
               return { ...ele };
            }
         });
      }
      default: {
         return [...state];
      }
   }
};

export default customersReducer;
