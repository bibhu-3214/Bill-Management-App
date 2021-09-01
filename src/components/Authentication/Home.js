import React from 'react';
import logo from '../../mobile-bill.webp';

const Home = () => {
   return (
      <div>
         <img
            src={logo}
            alt="bill"
            style={{
               display: 'block',
               marginLeft: 'auto',
               marginRight: 'auto',
               width: '50%',
            }}
         />
      </div>
   );
};

export default Home;
