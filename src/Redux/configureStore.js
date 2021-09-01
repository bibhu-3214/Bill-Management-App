import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import customersReducer from './Reducers/customersReducer';
import userReducer from './Reducers/userReducer';

const configureStore = () => {
   const store = createStore(
      combineReducers({
         users: userReducer,
         customers: customersReducer,
      }),
      applyMiddleware(thunk),
   );
   return store;
};

export default configureStore;
