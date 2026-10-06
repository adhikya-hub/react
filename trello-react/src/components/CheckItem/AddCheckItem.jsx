import { useState } from "react";

function AddCheckItem({ onAdd }) {
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setIsAdding(true);

      await onAdd(trimmedName);

      setName("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <form className="add-checkitem-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter checkitem"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={isAdding}
      />

      <button type="submit" disabled={isAdding}>
        {isAdding ? "Adding..." : "Add Checkitem"}
      </button>
    </form>
  );
}

export default AddCheckItem;
