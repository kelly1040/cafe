import {useContext, useState} from 'react';
import '../../src/css/login.css';
import {gql, useMutation} from '@apollo/client';
import {useForm} from '../utility/hook';
import {AuthContext} from '../context/authContext';
import {useNavigate} from 'react-router-dom';

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    userLogin(userInput:{ username: $username, password: $password}){
      username
      password
      token
    }
  }
`;

export default function Login() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const {onChange, onSubmit, values} = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { userLogin: userData } }) {
      context.login(userData);
      navigate('/inventory');
    },
    // onError({ graphQLErrors }) {
    //   setErrors(graphQLErrors);
    // },
    variables: {
      username: values.username,
      password: values.password,
    },
  });
  //if (error) return `Submission error! ${error.message}`;
  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="login">
      <form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={onChange}
          />
        </div>  
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={onChange}
          />
          {errors && errors.graphQLErrors && (
            <div className="error-messages">
              {errors.graphQLErrors.map((error, index) => (
                <p key={index}>{error.message}</p>
              ))}
            </div>
          )}
        </div>
        <button onClick={onSubmit}>Login</button>
      </form>
    </div>
  );
}