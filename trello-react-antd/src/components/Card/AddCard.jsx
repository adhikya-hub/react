import { useState } from "react";
import { Button, Input, Space } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

function AddCard({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  function handleClose() {
    setIsOpen(false);
    setName("");
  }

  async function handleSubmit() {
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
      <Button
        className="add-card-trigger"
        type="text"
        block
        icon={<PlusOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Add a card
      </Button>
    );
  }

  return (
    <Space direction="vertical" className="add-card-form" size="small">
      <Input
        placeholder="Enter card name"
        value={name}
        autoFocus
        onChange={(event) => setName(event.target.value)}
        onPressEnter={handleSubmit}
        onKeyDown={(event) => event.key === "Escape" && handleClose()}
        disabled={isAdding}
      />
      <Space>
        <Button type="primary" size="small" loading={isAdding} onClick={handleSubmit}>
          Add card
        </Button>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={handleClose}
        />
      </Space>
    </Space>
  );
}

export default AddCard;
