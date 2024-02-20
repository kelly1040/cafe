import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import './index.css';
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";
import Inventory from "./pages/inventory";
import ShoppingList from "./pages/shoppingList";
import AddProduct from "./pages/addProduct";

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql?',
  cache: new InMemoryCache(),
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
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(

  <ApolloProvider client={client}>
      <RouterProvider router={router}/>
  </ApolloProvider>
);
