
import { useQuery, gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query getProducts {
    products {
        _id
      name
      quantity
    }
  }
`;

function DisplayProducts() {
    const { loading, error, data } = useQuery(GET_PRODUCTS);
    console.log(useQuery(GET_PRODUCTS));
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map(({ _id, name, quantity }) => (
            <tr key={_id}>
              <td>{name}</td>
              <td>{quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
   );
  }

export default function Inventory() {
    return (
        <div>
            <h1>Inventory</h1>
            <DisplayProducts />
        </div>
    );
};