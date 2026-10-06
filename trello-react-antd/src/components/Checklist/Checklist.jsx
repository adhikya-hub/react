import { useEffect, useState } from "react";
import { Card, Typography, Button, Popconfirm, Spin, Alert, Progress } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { renameChecklist } from "../../api/checklistApi";
import {
  createCheckItem,
  deleteCheckItem,
  getChecklistItems,
  toggleCheckItem,
} from "../../api/checkitemApi";
import AddCheckItem from "../CheckItem/AddCheckItem";
import CheckItem from "../CheckItem/CheckItem";
import "./Checklist.css";

const { Text } = Typography;

function Checklist({ checklist, cardId, onUpdate, onDelete }) {
  const [checkItems, setCheckItems] = useState([]);
  const [checkItemsLoading, setCheckItemsLoading] = useState(true);
  const [checkItemsError, setCheckItemsError] = useState("");

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

  async function handleRename(name) {
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName === checklist.name) {
      return;
    }

    try {
      const updatedChecklist = await renameChecklist(checklist.id, trimmedName);
      onUpdate(updatedChecklist);
    } catch (error) {
      console.error(error);
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

  const completedCount = checkItems.filter(
    (item) => item.state === "complete",
  ).length;

  return (
    <Card
      className="checklist"
      size="small"
      title={
        <Text
          editable={{ onChange: handleRename, triggerType: ["text"] }}
          strong
        >
          {checklist.name}
        </Text>
      }
      extra={
        <Popconfirm
          title="Delete this checklist?"
          onConfirm={() => onDelete(checklist.id)}
          okText="Delete"
          okType="danger"
        >
          <Button type="text" size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      }
    >
      {checkItems.length > 0 && (
        <Progress
          percent={Math.round((completedCount / checkItems.length) * 100)}
          size="small"
          style={{ marginBottom: "0.5rem" }}
        />
      )}

      <AddCheckItem onAdd={handleAddCheckItem} />
      {checkItemsLoading && <Spin size="small" />}

      {checkItemsError && <Alert type="error" message={checkItemsError} showIcon />}

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
    </Card>
  );
}

export default Checklist;
