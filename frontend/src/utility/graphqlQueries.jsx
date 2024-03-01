import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation createProduct($productInput: ProductInput!) {
    createProduct(productInput: $productInput) {
      product {
        name
        quantity
        minQuantity
        unit
      }
      errors {
        message
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      _id
      name
      description
      quantity
      minQuantity
      unit
    }
  }
`;

export const GET_LIST = gql`
  query getShoppingList {
    getShoppingList {
      _id
      name
      description
      quantity
      minQuantity
      unit
    }
  }
`;

export const UPDATE_PRODUCT_QUANTITY = gql`
  mutation updateProductQuantity($id: ID!, $quantity: Float!) {
    updateProductQuantity(id: $id, quantityUpdate: { quantity: $quantity }) {
      product {
        quantity
      }
      errors {
        message
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $productUpdateInput: ProductUpdateInput!) {
    updateProduct(id: $id, productUpdateInput: $productUpdateInput) {
      product {
        _id
        name
        description
        quantity
        minQuantity
        unit
      }
      errors {
        message
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;
export const LOGIN_USER = gql`
  mutation login($userInput: UserInput!) {
    loginUser(userInput: $userInput) {
      user {
        username
        token
      }
      errors {
        message
      }
    }
  }
`;
