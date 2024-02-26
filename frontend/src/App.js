import {React} from 'react';
import { useContext } from 'react';
import NavBar from './components/nav.jsx';
import Login from './pages/login.jsx';
import { AuthContext } from './context/authContext.jsx';


function App() {
  const { user} = useContext(AuthContext);
  if(!user) {
     return <Login />}
  return (
    <div>
      <NavBar/>
    </div>
  ); 
}

export default App;