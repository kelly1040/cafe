import { useState, useEffect  } from "react";

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

const TableCell = ({ getValue, row, column, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    const onBlur = () => {
      table.options.meta?.updateData(row.index, column.id, value);
    };
    return (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  };

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
          // Add other columns as needed
        ];
        const [tableData, setTableData] = useState(() => [...data]);
        useEffect(() => {
            setTableData(data);
          }, [data]);
        
          const table = useReactTable({
            data: tableData,
            columns,
            getCoreRowModel: getCoreRowModel(),
            meta: {
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