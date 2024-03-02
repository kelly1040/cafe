import { useState, useEffect } from 'react';

export const TableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };
  const onSelectChange = (e) => {
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value);
  };
  const onIncrement = () => {
    setValue((prevValue) => prevValue + 1);
    tableMeta?.updateData(row.index, column.id, value + 1);
  };
  const onDecrement = () => {
    if (value > 0) {
      setValue((prevValue) => prevValue - 1);
      tableMeta?.updateData(row.index, column.id, value - 1);
    }
  };
  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === 'select' ? (
      <select onChange={onSelectChange} value={initialValue}>
        {columnMeta?.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <div className="incrementButton">
        <button onClick={onDecrement}>-</button>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          type={columnMeta?.type || 'text'}
        />
        <button onClick={onIncrement}>+</button>
      </div>
    );
  }
  return <span>{value}</span>;
};
