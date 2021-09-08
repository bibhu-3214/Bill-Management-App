const billsInitialState = { data: { bills: [], billDetails: {} } };

const billReducer = (state = billsInitialState.data, action) => {
    switch (action.type) {
        case 'ADD_BILL': {
            const newBills = [action.payload, ...state.bills];
            return { ...state, bills: newBills };
        }
        case 'GET_BILL': {
            return { ...state, bills: action.payload };
        }
        case 'REMOVE_BILL': {
            const result = state.bills.filter((bill) => bill._id !== action.payload);
            return { ...state, bills: result };
        }
        case 'GETBY_ID': {
            return { ...state, billDetails: action.payload };
        }
        default: {
            return { ...state };
        }
    }
};

export default billReducer;
