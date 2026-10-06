import { useState } from "react";
import { Input, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function AddCheckItem({ onAdd }) {
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
    <Space.Compact className="add-checkitem-form" style={{ width: "100%", marginBottom: "0.5rem" }}>
      <Input
        placeholder="Enter checkitem"
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

export default AddCheckItem;
