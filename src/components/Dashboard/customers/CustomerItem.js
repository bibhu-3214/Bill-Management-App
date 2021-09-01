import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
   getCustomerById,
   removeCustomer,
} from '../../../Redux/Actions/customersAction';
import EditCustomer from './EditCustomer';

const NotesItem = ({ ...note }) => {
   const [toggle, setToggle] = useState(false);

   const dispatch = useDispatch();

   const handleToggle = () => {
      const result = !toggle;
      setToggle(result);
   };

   const handleClick = (_id) => {
      dispatch(getCustomerById(_id));
   };

   const handleRemove = (_id) => {
      dispatch(removeCustomer(_id));
   };

   return (
      <>
         {toggle ? (
            <div
               className="p-3 bg-white"
               style={{ boxShadow: '0px 5px 4px -1px rgba(69,63,63,0.75)' }}
            >
               <EditCustomer
                  id={note._id}
                  title={note.title}
                  body={note.body}
                  handleToggle={handleToggle}
               />
               <button
                  className="btn btn-secondary ms-5"
                  onClick={handleToggle}
               >
                  cancel
               </button>
            </div>
         ) : (
            <div
               className="my-3 p-3 bg-white"
               style={{ boxShadow: '0px 5px 4px -1px rgba(69,63,63,0.75)' }}
            >
               <h2
                  className="text-capitalize"
                  style={{ color: '#5e35b1', cursor: 'pointer' }}
                  onClick={() => handleClick(note._id)}
               >
                  {note.title}
               </h2>
               <button className="btn btn-primary mx-1" onClick={handleToggle}>
                  edit
               </button>
               <button
                  className="btn btn-danger mx-1"
                  onClick={() => handleRemove(note._id)}
               >
                  delete
               </button>
            </div>
         )}
      </>
   );
};

export default NotesItem;
