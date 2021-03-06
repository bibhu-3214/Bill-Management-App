import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import customersReducer from './Reducers/customersReducer';
import userReducer from './Reducers/userReducer';
import productReducer from './Reducers/productReducer';
import billReducer from './Reducers/billReducer';

const configureStore = () => {
   const store = createStore(
      combineReducers({
         users: userReducer,
         customers: customersReducer,
         products: productReducer,
         bills: billReducer,
      }),
      applyMiddleware(thunk),
   );
   return store;
};

export default configureStore;
