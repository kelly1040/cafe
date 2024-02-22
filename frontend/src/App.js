import {React, useState} from 'react';
import NavBar from './pages/nav.jsx';
import Login from './pages/login.jsx';

function App() {
  const [token, setToken] = useState()
  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    
    <NavBar/>
 
  );
}

export default App;