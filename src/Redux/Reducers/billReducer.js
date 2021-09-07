const billsInitialState = [];

const billReducer = (state = billsInitialState, action) => {
   switch (action.type) {
      case 'ADD_BILL': {
         return [...state, action.payload];
      }
      case 'GET_BILL': {
         return [...action.payload];
      }
      case 'REMOVE_BILL': {
         return state.filter((ele) => ele._id !== action.payload._id);
      }
      default: {
         return [...state];
      }
   }
};

export default billReducer;
