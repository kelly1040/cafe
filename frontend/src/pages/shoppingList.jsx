import { useState, useEffect } from "react";
import '../../src/css/tables.css';
import { GET_PRODUCTS, GET_LIST, UPDATE_PRODUCT_QUANTITY } from '../utility/graphqlQueries';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery, useMutation} from '@apollo/client';
import { TableCell } from "../components/tableCell";
import { EditCell } from "../components/EditCell";

// Table component, renders the table
function Table({ data }) {
  const [replenishClicked, setReplenishClicked] = useState(false);
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: "Product Name",
    }),
    columnHelper.accessor("required", {
      header: replenishClicked ? "Replenish Quantity" : "Quantity Needed",
      cell: (props) => <TableCell {...props} updateProductQuantity={updateProductQuantity} />,
    }),
    columnHelper.accessor("unit", {
        header: "Unit",
      }),
    columnHelper.display({
        header: "Replenish",
      id: "edit",
      cell: (props) => <EditCell {...props} updateProductQuantity={updateProductQuantity} 
                        setReplenishClicked={setReplenishClicked}
                        buttonName="Replenish" />,
    }),
  ];

  const calculateDefaultQuantities = (data) => {
    return data.map((row) => {
      return {
        ...row,
        quantity: row.quantity, // Set the default value
        required: Math.ceil(row.minQuantity - row.quantity), // Calculate the default value
      };
    });
  };

  const [tableData, setTableData] = useState(() => calculateDefaultQuantities([...data]));
  const [editedRows, setEditedRows] = useState({});
  const [updateProductQuantity] = useMutation(UPDATE_PRODUCT_QUANTITY, {
    refetchQueries: [{ query: GET_LIST }, { query: GET_PRODUCTS }],
  });

  useEffect(() => {
    setTableData(calculateDefaultQuantities(data));
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      updateData: (rowIndex, columnId, value) => {
        setTableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function ShoppingList() {
  const { loading, error, data } = useQuery(GET_LIST, {
    refetchQueries: [{ query: GET_LIST} , {query: GET_PRODUCTS}],
  });
  const [searchInput, setSearchInput] = useState('');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const filterProducts = (products) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  };
  const filteredProducts = filterProducts(data.getShoppingList);
  return (
    <div className="page">
      <h1>Shopping List</h1>
      <input type="text" placeholder="Search for products" className="searchBar"
      value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}/>
      <Table data={filteredProducts} />
    </div>
  );
}