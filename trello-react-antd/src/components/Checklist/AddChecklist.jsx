import { useState } from "react";
import { Input, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function AddChecklist({ onAdd }) {
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

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

  return (
    <Space.Compact className="add-checklist-form" style={{ width: "100%", marginBottom: "0.75rem" }}>
      <Input
        placeholder="Enter checklist name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onPressEnter={handleSubmit}
        disabled={isAdding}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        loading={isAdding}
        onClick={handleSubmit}
      />
    </Space.Compact>
  );
}

export default AddChecklist;
