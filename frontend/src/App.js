import {React, useState} from 'react';
import { useContext } from 'react';
import NavBar from './components/nav.jsx';
import Login from './pages/login.jsx';
import { AuthContext } from './context/authContext.jsx';


function App() {
  const { user, logout} = useContext(AuthContext);
  const onLogout = () => {
    logout();
    return <Login />
  }
  if(!user) {
     console.log("hello");
     return <Login />}
  return (
    <NavBar/>
  ); 
}

export default App;