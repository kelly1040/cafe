import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ReactComponent as Waffle } from '../../src/assests/waffle_icon.svg';
import { useState } from "react";
import '../../src/css/nav.css';

export default function NavBar() {
    const [showNav, setShowNav] = useState(false);
    const handleShowNavbar = () => {
        setShowNav(!showNav)
      };
    return(
    <div className="columns">
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <div className="main-content">
          <main>
            <nav>
                <div className="container">
                <div className="homepage">
                    <NavLink to="/">Home</NavLink>
                </div>
                <div className="menu-icon" onClick={handleShowNavbar}>
                    menu<Waffle />
                </div>
                <div className={`nav-elements  ${showNav && 'active'}`}>
                    <NavLink to="/inventory">Inventory</NavLink>
                    <NavLink to="/shoppingList">Shopping List</NavLink>
                    <NavLink to="/addProduct">Add Product</NavLink>
                </div>
                </div>
            </nav>
            <Outlet/>
          </main>
        </div>
      </div>
    );
};