import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './Reducers/userReducer';

const configureStore = () => {
   const store = createStore(
      combineReducers({
         users: userReducer,
      }),
      applyMiddleware(thunk),
   );
   return store;
};

export default configureStore;
