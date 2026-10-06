import { useEffect, useState } from "react";
import { renameChecklist } from "../../api/checklistApi";
import {
  createCheckItem,
  deleteCheckItem,
  getChecklistItems,
  toggleCheckItem,
} from "../../api/checkitemApi";
import AddCheckItem from "../CheckItem/AddCheckItem";
import CheckItem from "../CheckItem/CheckItem";

function Checklist({ checklist, cardId, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(checklist.name);

  const [checkItems, setCheckItems] = useState([]);
  const [checkItemsLoading, setCheckItemsLoading] = useState(true);
  const [checkItemsError, setCheckItemsError] = useState("");

  useEffect(() => {
    setName(checklist.name);
  }, [checklist.name]);

  useEffect(() => {
    async function loadCheckItems() {
      try {
        setCheckItemsLoading(true);
        setCheckItemsError("");

        const data = await getChecklistItems(checklist.id);

        setCheckItems(data);
      } catch (error) {
        console.error(error);
        setCheckItemsError("Failed to load checkitems");
      } finally {
        setCheckItemsLoading(false);
      }
    }

    loadCheckItems();
  }, [checklist.id]);

  async function handleRename() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setName(checklist.name);
      setIsEditing(false);
      return;
    }

    if (trimmedName === checklist.name) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedChecklist = await renameChecklist(checklist.id, trimmedName);

      onUpdate(updatedChecklist);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setName(checklist.name);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleRename();
    }

    if (event.key === "Escape") {
      setName(checklist.name);
      setIsEditing(false);
    }
  }

  async function handleAddCheckItem(name) {
    const newCheckItem = await createCheckItem(checklist.id, name);

    setCheckItems((previousCheckItems) => [
      newCheckItem,
      ...previousCheckItems,
    ]);
  }
  async function handleDeleteCheckItem(checkItemId) {
    await deleteCheckItem(checklist.id, checkItemId);

    setCheckItems((previousCheckItems) =>
      previousCheckItems.filter((item) => item.id !== checkItemId),
    );
  }

  async function handleToggleCheckItem(checkItemId, currentState) {
    const newState = currentState === "complete" ? "incomplete" : "complete";

    try {
      const updatedCheckItem = await toggleCheckItem(
        cardId,
        checkItemId,
        newState,
      );

      setCheckItems((previousCheckItems) =>
        previousCheckItems.map((item) =>
          item.id === updatedCheckItem.id ? updatedCheckItem : item,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }
  function handleUpdateCheckItem(updatedItem) {
    setCheckItems((previousCheckItems) =>
      previousCheckItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
  }

  return (
    <div className="checklist">
      <div className="checklist-header">
        {isEditing ? (
          <input
            value={name}
            autoFocus
            onChange={(event) => setName(event.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <h3 className="checklist-title" onClick={() => setIsEditing(true)}>
            {checklist.name}
          </h3>
        )}

        <button
          className="checklist-delete"
          onClick={() => onDelete(checklist.id)}
        >
          Delete
        </button>
      </div>

      <AddCheckItem onAdd={handleAddCheckItem} />
      {checkItemsLoading && <p>Loading checkitems...</p>}

      {checkItemsError && <p>{checkItemsError}</p>}

      <div className="checkitem-list">
        {!checkItemsLoading &&
          !checkItemsError &&
          checkItems.map((item) => (
            <CheckItem
              key={item.id}
              item={item}
              cardId={cardId}
              onDelete={handleDeleteCheckItem}
              onToggle={handleToggleCheckItem}
              onUpdate={handleUpdateCheckItem}
            />
          ))}
      </div>
    </div>
  );
}

export default Checklist;
