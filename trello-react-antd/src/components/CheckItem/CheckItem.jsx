import { useState } from "react";
import { Checkbox, Typography, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { renameCheckItem } from "../../api/checkitemApi";
import "./CheckItem.css";

const { Text } = Typography;

function CheckItem({ item, onDelete, onToggle, onUpdate, cardId }) {
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleRename(name) {
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName === item.name) {
      return;
    }

    try {
      const updatedItem = await renameCheckItem(cardId, item.id, trimmedName);
      onUpdate(updatedItem);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="checkitem">
      <Checkbox
        checked={isCompleted}
        onChange={() => onToggle(item.id, item.state)}
      />

      <Text
        delete={isCompleted}
        type={isCompleted ? "secondary" : undefined}
        editable={{ onChange: handleRename, triggerType: ["text"] }}
        className="checkitem-name"
      >
        {item.name}
      </Text>

      <Button
        className="checkitem-delete"
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        loading={isDeleting}
        onClick={handleDelete}
      />
    </div>
  );
}

export default CheckItem;
