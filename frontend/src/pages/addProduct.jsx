import {useForm} from '../utility/hook';
import { useMutation, gql } from '@apollo/client';

// GraphQL mutation
const CREATE_PRODUCT = gql`
  mutation createProduct($productInput: ProductInput!) {
    createProduct(productInput: $productInput) {
      name
      quantity
      minQuantity
      unit
    }
  }
`;
//graphql queries
const GET_PRODUCTS = gql`
  query getProducts {
    products {
      _id
      name
      description
      quantity
      minQuantity
      unit
    }
  }
`;

//graphql queries
const GET_LIST = gql`
  query getShoppingList {
    getShoppingList {
      _id
      name
      quantity
    }
  }
`;

export default function AddProduct() {
  const {onChange, onSubmit, values, resetForm} = useForm(addProductCallback, {
    name: '',
    description: '',
    quantity: '',
    minQuantity: '',
    unit: '',
  });
  
  const [addProduct, { loading }] = useMutation(CREATE_PRODUCT, {
    variables: {
      productInput: {
        name: values.name,
        description: values.description,
        quantity: parseFloat(values.quantity),
        minQuantity: parseFloat(values.minQuantity),
        unit: values.unit,
      },
    },
      refetchQueries: [{ query: GET_PRODUCTS }, { query: GET_LIST }],
    });

  function addProductCallback() {
    addProduct();
    resetForm();
  }

 return(
  <div>
    <form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
      <h1>Add Product</h1>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          value={values.description}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          name="quantity"
          min='0'
          value={values.quantity}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="minQuantity">Minimum Quantity</label>
        <input
          type="number"
          name="minQuantity"
          min='1'
          value={values.minQuantity}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="unit">Unit</label>
        <input
          type="text"
          name="unit"
          value={values.unit}
          onChange={onChange}
        />
      </div>
      <button type="submit">Add Product</button>
    </form>
  </div>
 )
}


