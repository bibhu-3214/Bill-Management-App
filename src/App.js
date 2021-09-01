import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';

const App = () => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);

   const handleAuth = () => {
      setIsLoggedIn(!isLoggedIn);
   };

   useEffect(() => {
      if (localStorage.getItem('token')) {
         handleAuth();
      }
   }, []);

   return (
      <div>
         <Navigation isLoggedIn={isLoggedIn} handleAuth={handleAuth} />
      </div>
   );
};

export default App;
