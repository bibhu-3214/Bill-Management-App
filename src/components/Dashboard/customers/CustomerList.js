import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCustomers } from '../../../Redux/Actions/customersAction';
import CustomerItem from './CustomerItem';

const CustomerList = (props) => {
   const customers = useSelector((state) => state.customers);
   const dispatch = useDispatch();
   useEffect(() => {
      dispatch(getCustomers());
   }, [dispatch]);

   return (
      <>
         {customers.length === 0 ? (
            <h4 className="display-5">No Customer found...</h4>
         ) : (
            <>
               {customers.map((customer, id) => {
                  return <CustomerItem key={id} {...customer} />;
               })}
            </>
         )}
      </>
   );
};

export default CustomerList;
