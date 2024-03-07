export const EditCell = ({
  row,
  table,
  updateProductQuantity,
  setReplenishClicked = null,
  buttonName
}) => {
  const meta = table.options.meta;
  const setEditedRows = () => {
    meta?.setEditedRows((old) => ({
      ...old,
      [row.id]: !old[row.id]
    }));

    // Execute GraphQL mutation here
    const { _id, quantity, required = 0 } = row.original;
    updateProductQuantity({
      variables: {
        id: _id,
        quantity: parseFloat(quantity + required)
      }
    });
    if (buttonName === 'Replenish') {
      setReplenishClicked(false);
    }
  };

  const handleButtonClick = () => {
    if (buttonName === 'Replenish') {
      setReplenishClicked(true);
    }
  };

  return meta?.editedRows[row.id] ? (
    <>
      <button onClick={setEditedRows} name="done">
        Save
      </button>
    </>
  ) : (
    <button
      onClick={() => {
        meta?.setEditedRows?.((old) => ({ ...old, [row.id]: true }));
        handleButtonClick();
      }}
      name="edit"
    >
      {buttonName}
    </button>
  );
};
