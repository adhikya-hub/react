import { useEffect, useState } from "react";
import { Modal, Typography, Button, Popconfirm, Spin, Alert, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { archiveCard, renameCard } from "../../api/cardApi";
import Checklist from "../Checklist/Checklist";
import {
  createChecklist,
  deleteChecklist,
  getCardChecklists,
} from "../../api/checklistApi";
import AddChecklist from "../Checklist/AddChecklist";
import "./CardModal.css";

const { Title } = Typography;

function CardModal({ card, onClose, onUpdate, onDelete }) {
  const [isArchiving, setIsArchiving] = useState(false);

  const [checklists, setChecklists] = useState([]);
  const [checklistsLoading, setChecklistsLoading] = useState(false);
  const [checklistsError, setChecklistsError] = useState("");

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

  async function handleRename(name) {
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName === card.name) {
      return;
    }

    try {
      const updatedCard = await renameCard(card.id, trimmedName);
      onUpdate(updatedCard);
    } catch (error) {
      console.error(error);
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
    <Modal
      className="card-modal"
      open={!!card}
      onCancel={onClose}
      footer={null}
      title={
        card && (
          <Title
            level={4}
            editable={{ onChange: handleRename, triggerType: ["text"] }}
            style={{ margin: 0, paddingRight: "1.5rem" }}
          >
            {card.name}
          </Title>
        )
      }
      destroyOnClose
    >
      {card && (
        <>
          <Popconfirm
            title="Archive this card?"
            onConfirm={handleArchive}
            okText="Archive"
            okType="danger"
          >
            <Button danger size="small" loading={isArchiving} icon={<DeleteOutlined />}>
              Archive
            </Button>
          </Popconfirm>

          <Divider orientation="left" plain>
            Checklists
          </Divider>

          <AddChecklist onAdd={handleAddChecklist} />

          {checklistsLoading && <Spin size="small" />}

          {checklistsError && <Alert type="error" message={checklistsError} showIcon />}

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
        </>
      )}
    </Modal>
  );
}

export default CardModal;
