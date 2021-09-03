import React from 'react';
import logo from '../../Invoice_design_inspiration_jpg_EJVU70ct-700x410.jpg';

const Home = () => {
   return (
      <div style={{ margin: 0, padding: 0, backgroundColor: '#F5EDEB' }}>
         <img
            src={logo}
            alt="bill"
            style={{
               display: 'block',
               marginLeft: 'auto',
               marginRight: 'auto',
               width: '70%',
            }}
         />
      </div>
   );
};

export default Home;
