import { useState, useEffect, useMutation  } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
          type={columnMeta?.type || "text"}
        />
      )
    }
    return <span>{value}</span>
  }

  const EditCell = ({ row, table }) => {
    const meta = table.options.meta
    const setEditedRows = (e) => {
        const elName = e.currentTarget.name
      meta?.setEditedRows((old) => ({
        ...old,
        [row.id]: !old[row.id],
      }))
    }
    return meta?.editedRows[row.id] ? (
        <>
          <button onClick={setEditedRows} name="done">
            Done
          </button>
        </>
      ) : (
        <button onClick={setEditedRows} name="edit">
          Update
        </button>
      )
  }
  

function Table({data}){
        const columnHelper = createColumnHelper();
        const columns = [
          columnHelper.accessor("name", {
            header: "Product Name",
          }),
          columnHelper.accessor("quantity", {
            header: "Quantity",
            cell: TableCell,
          }),
          columnHelper.display({
            id: "edit",
            cell: EditCell,
          }),
 
        ];
        const [tableData, setTableData] = useState(() => [...data]);
        const [editedRows, setEditedRows] = useState({});
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


export default function ShoppingList() {
    const { loading, error, data } = useQuery(GET_PRODUCTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <div>
            <h1>Shopping List</h1>
            <Table data={data.products}/>
        </div>
    );
};