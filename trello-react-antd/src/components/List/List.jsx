import { useEffect, useState } from "react";
import { Card, Typography, Badge, Button, Popconfirm, Spin, Alert } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { createCard, getListCards } from "../../api/cardApi";
import CardItem from "../Card/Card";
import AddCard from "../Card/AddCard";
import CardModal from "../Card/CardModal";
import "./List.css";

const { Text } = Typography;

function List({ list, onRename, onDelete }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  async function handleRename(name) {
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName === list.name) {
      return;
    }

    try {
      await onRename(list.id, trimmedName);
    } catch (error) {
      console.error(error);
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
    <Card
      className="list"
      size="small"
      title={
        <Text
          editable={{ onChange: handleRename, triggerType: ["text"] }}
          strong
        >
          {list.name}
        </Text>
      }
      extra={
        <div className="list-extra">
          {!loading && !error && <Badge count={cards.length} color="#8f5aa8" />}

          <Popconfirm
            title="Delete this list?"
            onConfirm={() => onDelete(list.id)}
            okText="Delete"
            okType="danger"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      }
    >
      {loading && <Spin size="small" />}

      {error && <Alert type="error" message={error} showIcon />}

      <div className="cards-container">
        {!loading &&
          !error &&
          cards.map((card) => (
            <CardItem key={card.id} card={card} onOpen={setSelectedCard} />
          ))}
      </div>

      <AddCard onAdd={handleAddCard} />

      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdate={handleUpdateCard}
        onDelete={handleDeleteCard}
      />
    </Card>
  );
}

export default List;
