import { useState } from "react";
import { Button, Input, Space } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

function AddList({ onAdd }) {
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
        className="add-list-trigger"
        type="text"
        icon={<PlusOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Add another list
      </Button>
    );
  }

  return (
    <Space direction="vertical" className="add-list-form" size="small">
      <Input
        placeholder="Enter list name"
        value={name}
        autoFocus
        onChange={(event) => setName(event.target.value)}
        onPressEnter={handleSubmit}
        onKeyDown={(event) => event.key === "Escape" && handleClose()}
        disabled={isAdding}
      />
      <Space>
        <Button type="primary" loading={isAdding} onClick={handleSubmit}>
          Add list
        </Button>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
        />
      </Space>
    </Space>
  );
}

export default AddList;
