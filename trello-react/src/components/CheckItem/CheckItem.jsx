import { useState, useEffect } from "react";

function CheckItem({ item, onDelete, onToggle, onUpdate, cardId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);

  useEffect(() => {
    setName(item.name);
  }, [item.name]);

  const isCompleted = item.state === "complete";

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await onDelete(item.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }
  async function handleRename() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setName(item.name);
      setIsEditing(false);
      return;
    }

    if (trimmedName === item.name) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedItem = await renameCheckItem(cardId, item.id, trimmedName);

      onUpdate(updatedItem);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setName(item.name);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleRename();
    }

    if (event.key === "Escape") {
      setName(item.name);
      setIsEditing(false);
    }
  }

  return (
    <div className="checkitem">
      <input
        type="checkbox"
        className="checkitem-checkbox"
        checked={isCompleted}
        onChange={() => onToggle(item.id, item.state)}
      />

      {isEditing ? (
        <input
          className="checkitem-input"
          value={name}
          autoFocus
          onChange={(event) => setName(event.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className={
            isCompleted ? "checkitem-name completed" : "checkitem-name"
          }
          onClick={() => setIsEditing(true)}
        >
          {item.name}
        </span>
      )}

      <button
        className="checkitem-delete"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}

export default CheckItem;
