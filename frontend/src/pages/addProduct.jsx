import { useForm } from '../utility/hook';
import { useMutation } from '@apollo/client';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../src/context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../../src/css/forms.css';
import {
  CREATE_PRODUCT,
  GET_PRODUCTS,
  GET_LIST
} from '../utility/graphqlQueries';



export default function AddProduct() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);

  //check if user has access TODO: add access field to users instead of checking username
  useEffect(() => {
    if (user.username !== "manager") {
      navigate('/inventory');
    }
  }, [user.username, navigate]);

  const { onChange, onSubmit, values, resetForm } = useForm(
    addProductCallback,
    {
      name: '',
      description: '',
      quantity: '',
      minQuantity: '',
      unit: ''
    }
  );

  const [addProduct, { loading }] = useMutation(CREATE_PRODUCT, {
    update(_, { data }) {
      const { createProduct: productData } = data || {};
      if (productData.product) {
        resetForm();
        setErrors({});
      } else {
        // has an error
        setErrors({});
        setErrors({ ...errors, name: [productData.errors[0].message] });
      }
    },
    variables: {
      productInput: {
        name: values.name,
        description: values.description,
        quantity: parseFloat(values.quantity),
        minQuantity: parseFloat(values.minQuantity),
        unit: values.unit
      }
    },
    refetchQueries: [{ query: GET_PRODUCTS }, { query: GET_LIST }]
  });

  const validateForm = () => {
    const requiredFields = formFields.filter(
      (field) => field.require === 'true'
    );
    const missingFields = requiredFields.filter((field) => !values[field.name]);

    if (missingFields.length > 0) {
      missingFields.forEach((field) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field.name]: 'Input Required'
        }));
      });
      return false;
    }

    return true;
  };

  function addProductCallback() {
    setErrors({});
    if (validateForm()) {
      setErrors({});
      addProduct();
    }
  }

  // add the input fields needed
  const formFields = [
    { label: 'Name *', 
      type: 'text', 
      name: 'name', 
      require: 'true' 
    },
    { label: 'Description',
      type: 'text', 
      name: 'description' 
    },
    {
      label: 'Quantity *',
      type: 'number',
      name: 'quantity',
      min: '0',
      require: 'true'
    },
    {
      label: 'Minimum Quantity *',
      type: 'number',
      name: 'minQuantity',
      min: '1',
      require: 'true'
    },
    { label: 'Unit *', 
      type: 'text', 
      name: 'unit', 
      require: 'true' 
    }
  ];

  return (

    <div className="page">
      <form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Add Product</h1>
        {formFields.map((field, index) => {
          return (
            <div key={index} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={values[field.name]}
                min={field.min}
                onChange={onChange}
                required={field.require === 'true'}
              />
              <span className="error-messages">{errors[field.name]}</span>
            </div>
          );
        })}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
