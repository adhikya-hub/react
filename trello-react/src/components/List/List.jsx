import { useEffect, useState } from "react";
import { createCard, getListCards } from "../../api/cardApi";
import Card from "../Card/Card";
import AddCard from "../Card/AddCard";
import CardModal from "../Card/CardModal";
import "./List.css";

function List({ list, onRename, onDelete }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(list.name);

  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    async function loadCards() {
      try {
        const data = await getListCards(list.id);
        setCards(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load cards");
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, [list.id]);

  useEffect(() => {
    setName(list.name);
  }, [list.name]);

  async function handleRename() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setName(list.name);
      setIsEditing(false);
      return;
    }

    if (trimmedName === list.name) {
      setIsEditing(false);
      return;
    }

    try {
      await onRename(list.id, trimmedName);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setName(list.name);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleRename();
    }
    if (event.key === "Escape") {
      setName(list.name);
      setIsEditing(false);
    }
  }

  async function handleAddCard(cardName) {
    try {
      const newCard = await createCard(list.id, cardName);

      setCards((previousCards) => [newCard, ...previousCards]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  function handleUpdateCard(updatedCard) {
    setCards((previousCards) =>
      previousCards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card,
      ),
    );
    setSelectedCard(updatedCard);
  }

  function handleDeleteCard(cardId) {
    setCards((previousCards) =>
      previousCards.filter((card) => card.id !== cardId),
    );
  }

  return (
    <div className="list">
      <div className="list-header">
        {isEditing ? (
          <input
            value={name}
            autoFocus
            onChange={(event) => setName(event.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <h2 className="list-title" onClick={() => setIsEditing(true)}>
            {list.name}
          </h2>
        )}

        {!loading && !error && (
          <span className="list-count">{cards.length}</span>
        )}

        <button className="list-delete" onClick={() => onDelete(list.id)}>
          Delete
        </button>
      </div>

      {loading && <p>Loading cards...</p>}

      {error && <p>{error}</p>}

      <div className="cards-container">
        {!loading &&
          !error &&
          cards.map((card) => (
            <Card key={card.id} card={card} onOpen={setSelectedCard} />
          ))}
      </div>

      <AddCard onAdd={handleAddCard} />

      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdate={handleUpdateCard}
        onDelete={handleDeleteCard}
      />
    </div>
  );
}

export default List;
