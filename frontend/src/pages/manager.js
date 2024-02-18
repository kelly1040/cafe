import{ NavLink } from 'react-router-dom';

export default function Manager() {
    return (
        <div>
          <nav>
            <NavLink to="/inventory">Inventory</NavLink>
            <NavLink to="/shoppingList">Shopping List</NavLink>
          </nav>
        </div>
    );
};