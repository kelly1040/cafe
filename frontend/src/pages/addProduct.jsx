import {useForm} from '../utility/hook';
import { useMutation} from '@apollo/client';
import {useState} from 'react';
import '../../src/css/forms.css';
import { CREATE_PRODUCT, GET_PRODUCTS, GET_LIST } from '../utility/graphqlQueries';

export default function AddProduct() {
  const [errors, setErrors] = useState({});
  const {onChange, onSubmit, values, resetForm} = useForm(addProductCallback, {
    name: '',
    description: '',
    quantity: '',
    minQuantity: '',
    unit: '',
  });
  
  const [addProduct, { loading }] = useMutation(CREATE_PRODUCT, {
    update(_, { data }) {
      const { createProduct: productData } = data || {};
      if (productData.product) {
        // added product succesfully
        resetForm() // empty input fields
        setErrors({})  // reset error
      }else{
        // has an error 
        setErrors(productData);
      }
    },
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
  }

 return(
  <div className="page">
    <form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
      <h1>Add Product</h1>
      {errors.errors && (
            <div className="error-messages">
              {errors.errors.map((error, index) => (
                <p key={index}>{error.message}</p>
              ))}
            </div>
        )}
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


