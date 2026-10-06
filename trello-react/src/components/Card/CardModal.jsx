import { useEffect, useState } from "react";
import { archiveCard, renameCard } from "../../api/cardApi";
import Checklist from "../Checklist/Checklist";
import {
  createChecklist,
  deleteChecklist,
  getCardChecklists,
} from "../../api/checklistApi";
import AddChecklist from "../Checklist/AddChecklist";
import "./CardModal.css";

function CardModal({ card, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isArchiving, setIsArchiving] = useState(false);

  const [checklists, setChecklists] = useState([]);
  const [checklistsLoading, setChecklistsLoading] = useState(false);
  const [checklistsError, setChecklistsError] = useState("");

  useEffect(() => {
    if (card) {
      setName(card.name);
    }
  }, [card]);

  useEffect(() => {
    if (!card) {
      return;
    }

    async function loadChecklists() {
      try {
        setChecklistsLoading(true);
        setChecklistsError("");

        const data = await getCardChecklists(card.id);

        setChecklists(data);
      } catch (error) {
        console.error(error);
        setChecklistsError("Failed to load checklists");
      } finally {
        setChecklistsLoading(false);
      }
    }

    loadChecklists();
  }, [card]);

  if (!card) {
    return null;
  }

  async function handleRename() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setName(card.name);
      setIsEditing(false);
      return;
    }

    if (trimmedName === card.name) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedCard = await renameCard(card.id, trimmedName);

      onUpdate(updatedCard);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setName(card.name);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleRename();
    }

    if (event.key === "Escape") {
      setName(card.name);
      setIsEditing(false);
    }
  }

  async function handleAddChecklist(name) {
    const newChecklist = await createChecklist(card.id, name);

    setChecklists((previousChecklists) => [
      newChecklist,
      ...previousChecklists,
    ]);
  }
  function handleUpdateChecklist(updatedChecklist) {
    setChecklists((previousChecklists) =>
      previousChecklists.map((checklist) =>
        checklist.id === updatedChecklist.id ? updatedChecklist : checklist,
      ),
    );
  }
  async function handleDeleteChecklist(checklistId) {
    try {
      await deleteChecklist(checklistId);

      setChecklists((previousChecklists) =>
        previousChecklists.filter((checklist) => checklist.id !== checklistId),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleArchive() {
    try {
      setIsArchiving(true);

      await archiveCard(card.id);

      onDelete(card.id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsArchiving(false);
    }
  }

  return (
    <>
      <title>{card.name}</title>
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            {isEditing ? (
              <input
                value={name}
                autoFocus
                onChange={(event) => setName(event.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <h2 onClick={() => setIsEditing(true)}>{card.name}</h2>
            )}

            <button onClick={onClose}>X</button>
          </div>

          <button
            className="archive-button"
            onClick={handleArchive}
            disabled={isArchiving}
          >
            {isArchiving ? "Archiving..." : "Archive"}
          </button>

          <h3>Checklists</h3>

          <AddChecklist onAdd={handleAddChecklist} />

          {checklistsLoading && <p>Loading checklists...</p>}

          {checklistsError && <p>{checklistsError}</p>}

          <div className="checklists-container">
            {!checklistsLoading &&
              !checklistsError &&
              checklists.map((checklist) => (
                <Checklist
                  key={checklist.id}
                  checklist={checklist}
                  cardId={card.id}
                  onUpdate={handleUpdateChecklist}
                  onDelete={handleDeleteChecklist}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardModal;
