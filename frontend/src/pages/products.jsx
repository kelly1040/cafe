import { useState, useEffect } from "react";
import '../../src/css/tables.css';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery, useMutation, gql } from '@apollo/client';

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

const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $productUpdateInput: ProductUpdateInput!) {
    updateProduct(id: $id, productUpdateInput: $productUpdateInput) {
      _id
      name
      description
      quantity
      minQuantity
      unit
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!){
    deleteProduct(id: $id)
  }
`

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
        <input
          value={value}
          className="editCell"
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          type={columnMeta?.type || "text"}
        />
    )
  }
  return <span>{value}</span>
}

const EditCell = ({ row, table, updateProduct }) => {
    const meta = table.options.meta;
  
    const setEditedRows = () => {
      meta?.setEditedRows((old) => ({
        ...old,
        [row.id]: !old[row.id],
      }));
  
      const { _id, name, description, quantity, minQuantity, unit } = row.original;
      updateProduct({
        variables: {
          id: _id,
          productUpdateInput: {
            name,
            description,
            quantity: parseFloat(quantity),
            minQuantity: parseFloat(minQuantity),
            unit,
          },
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
        Edit
      </button>
    );
  };

  const DeleteCell = ({ row, deleteProduct }) => {
    const { _id } = row.original;
  
    const handleDelete = () => {
      deleteProduct({
        variables: {
          id: _id,
        },
      });
    };
  
    return (
      <button onClick={handleDelete} name="delete">
        Delete
      </button>
    );
  };

// Table component, renders the table
function Table({ data }) {
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: "Product Name",
      cell: (props) => <TableCell {...props} updateProduct={updateProduct} />,
    }),
    columnHelper.accessor("description", {
        header: "Description",
        cell: (props) => <TableCell {...props} updateProduct={updateProduct} />,
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
      cell: (props) => <TableCell {...props} updateProduct={updateProduct} />,
      meta: { type: "number", min: 0}
    }),
    columnHelper.accessor("minQuantity", {
        header: "Minimum Quantity",
        cell: (props) => <TableCell {...props} updateProduct={updateProduct} />,
        meta: { type: "number", min: 1 }
    }),
    columnHelper.accessor("unit", {
        header: "Unit",
        cell: (props) => <TableCell {...props} updateProduct={updateProduct} />,
      }),
    columnHelper.display({
      header: "Edit",
      id: "edit",
      cell: (props) => <EditCell {...props} updateProduct={updateProduct} />,
    }),
    columnHelper.display({
       header: "Delete",
       id: "Delete",
       cell: (props) => <DeleteCell {...props} deleteProduct={deleteProduct} />,
    })
  ];

  const [tableData, setTableData] = useState(() => [...data]);
  const [editedRows, setEditedRows] = useState({});
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }, { query: GET_LIST }],
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }, { query: GET_LIST }],
  });

  useEffect(() => {
    setTableData(data);
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

export default function Products() {
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    refetchQueries: [{ query: GET_PRODUCTS}, {query: GET_LIST }],
  });
  const [searchInput, setSearchInput] = useState('');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const filterProducts = (products) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  };
  const filteredProducts = filterProducts(data.products);
  return (
    <div className="page">
      <h1>All Products</h1>
      <input type="text" placeholder="Search for a product" className="searchBar"
      value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
      <Table data={filteredProducts} />
    </div>
  );
}