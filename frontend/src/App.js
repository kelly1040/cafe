import React from 'react';
import{ Link } from 'react-router-dom';
import { Outlet } from "react-router-dom";

function App() {

  return (
    <>
      <div className="columns">
        <div className="main-content">
          <main>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/inventory">Inventory</Link>
              <Link to="/shoppingList">Shopping List</Link>
            </nav>
            <Outlet/>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;