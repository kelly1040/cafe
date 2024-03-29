import { NavLink, Outlet } from 'react-router-dom';
import { ReactComponent as Waffle } from '../../src/assets/waffleIcon.svg';
import { useState, useContext } from 'react';
import '../../src/css/nav.css';
import { AuthContext } from '../context/authContext.jsx';

export default function NavBar() {
  const [showNav, setShowNav] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const handleShowNavbar = () => {
    setShowNav(!showNav);
  };
  return (
    <div className="columns">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>
      <div className="main-content">
        <main>
          <nav>
            <div className="container">
              {/* <div className="homepage">
                      <NavLink to="/">Home</NavLink>
                  </div> */}
              <div className={`nav-elements  ${showNav && 'active'}`}>
                <NavLink to="/inventory">Inventory</NavLink>
                <NavLink to="/shoppingList">Shopping List</NavLink>
                {user.username === 'manager' && (
                  <>
                    <NavLink to="/addProduct">Add Product</NavLink>
                    <NavLink to="/products" className="webOnly">
                      All Products
                    </NavLink>
                  </>
                )}
                <button className="logout" onClick={logout}>
                  Logout
                </button>
              </div>
              <div className="menu-icon" onClick={handleShowNavbar}>
                menu
                <Waffle />
              </div>
            </div>
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
