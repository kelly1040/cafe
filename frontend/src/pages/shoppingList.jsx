import { useState, useEffect } from "react";
import "../../src/css/table.css";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery, useMutation, gql } from '@apollo/client';

//graphql queries
const GET_LIST = gql`
  query getShoppingList {
    getShoppingList {
      _id
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
      quantity
    }
  }
`;

const UPDATE_PRODUCT_QUANTITY = gql`
    mutation updateProductQuantity($id: ID!, $quantity: Float!) {
        updateProductQuantity(id: $id, quantityUpdate: {quantity: $quantity}) {
            quantity
        }
    }
`;

const TableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue()
  const columnMeta = column.columnDef.meta
  const tableMeta = table.options.meta
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value)
  }
  const onSelectChange = (e) => {
    setValue(e.target.value)
    tableMeta?.updateData(row.index, column.id, e.target.value)
  }
  const onIncrement = () => {
    setValue((prevValue) => prevValue + 1);
    tableMeta?.updateData(row.index, column.id, value + 1);
  }
  const onDecrement = () => {
    if (value > 0) {
      setValue((prevValue) => prevValue - 1);
      tableMeta?.updateData(row.index, column.id, value - 1);
    }
  }

  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === "select" ? (
      <select onChange={onSelectChange} value={initialValue}>
        {columnMeta?.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <div>
        <button onClick={onDecrement}>-</button>
        <input
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          type={columnMeta?.type || "text"}
        />
        <button onClick={onIncrement}>+</button>
      </div>
    )
  }
  return <span>{value}</span>
}

const EditCell = ({ row, table, updateProductQuantity }) => {
  const meta = table.options.meta;

  const setEditedRows = () => {
    meta?.setEditedRows((old) => ({
      ...old,
      [row.id]: !old[row.id],
    }));

    // Execute GraphQL mutation here
    const { _id, quantity, required } = row.original;
    updateProductQuantity({
      variables: {
        id: _id,
        quantity: parseFloat(quantity+required),
      },
    });
  };

  return meta?.editedRows[row.id] ? (
    <>
      <button onClick={setEditedRows} name="done">
        Done
      </button>
    </>
  ) : (
    <button onClick={() => meta?.setEditedRows((old) => ({ ...old, [row.id]: true }))} name="edit">
      Replenish
    </button>
  );
};

// Table component, renders the table
function Table({ data }) {
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: "Product Name",
    }),
    columnHelper.accessor("required", {
      header: "Quantity Needed",
      cell: (props) => <TableCell {...props} updateProductQuantity={updateProductQuantity} />,
    }),
    columnHelper.accessor("unit", {
        header: "Unit",
      }),
    columnHelper.display({
        header: "Replenish",
      id: "edit",
      cell: (props) => <EditCell {...props} updateProductQuantity={updateProductQuantity} />,
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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Shopping List</h1>
      <Table data={data.getShoppingList} />
    </div>
  );
}