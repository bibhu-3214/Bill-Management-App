const billsInitialState = [];

const billReducer = (state = billsInitialState, action) => {
   switch (action.type) {
      case 'ADD_BILL': {
         return [action.payload, ...state];
      }
      case 'GET_ITEM': {
         return [...action.payload];
      }
      case 'REMOVE_ITEM': {
         return state.filter((ele) => ele._id !== action.payload);
      }
      default: {
         return [...state];
      }
   }
};

export default billReducer;
