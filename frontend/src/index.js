import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import '../src/css/index.css';
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { AuthProvider } from './context/authContext'; 
 
import App from "./App";
import Inventory from "./pages/inventory";
import ShoppingList from "./pages/shoppingList";
import AddProduct from "./pages/addProduct";
import Login from "./pages/login";
import Products from './pages/products';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql?',
  cache: new InMemoryCache(),
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || "",
    },
  };
});


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/inventory",
        element: <Inventory />
      },
      {
        path: "/shoppingList",
        element: <ShoppingList />
      },
      {
        path: "/addProduct",
        element: <AddProduct />
      },
      {
        path: "/products",
        element: <Products />
      },
      {
        path: "/login",
        element: <Login />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
  <ApolloProvider client={client}>
      <RouterProvider router={router}/>
  </ApolloProvider>
  </AuthProvider>
);
