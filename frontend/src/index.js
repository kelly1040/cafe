import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import '../src/css/index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/authContext';

import App from './App';
import Inventory from './pages/Inventory';
import ShoppingList from './pages/ShoppingList';
import AddProduct from './pages/AddProduct';
import Login from './pages/LoginUser';
import Products from './pages/Products';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql?'
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/inventory',
        element: <Inventory />
      },
      {
        path: '/shoppingList',
        element: <ShoppingList />
      },
      {
        path: '/addProduct',
        element: <AddProduct />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </AuthProvider>
);
