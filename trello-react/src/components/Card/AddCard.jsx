import { useState } from "react";

function AddCard({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  function handleClose() {
    setIsOpen(false);
    setName("");
  }

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

  if (!isOpen) {
    return (
      <button className="add-card-trigger" onClick={() => setIsOpen(true)}>
        + Add a card
      </button>
    );
  }

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter card name"
        value={name}
        autoFocus
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && handleClose()}
        disabled={isAdding}
      />
      <div className="add-card-actions">
        <button type="submit" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add card"}
        </button>
        <button type="button" className="cancel-button" onClick={handleClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddCard;
