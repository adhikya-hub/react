import { useEffect, useState } from "react";
import { Layout, Typography, Spin, Alert } from "antd";
import {
  createList,
  getBoardLists,
  renameList,
  deleteList,
} from "../../api/boardApi";
import List from "../List/List";
import AddList from "../List/AddList";
import "./Board.css";

const { Header, Content } = Layout;
const { Title } = Typography;

function Board() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBoard() {
      try {
        const data = await getBoardLists(import.meta.env.VITE_TRELLO_BOARD_ID);
        setLists(data);
      } catch (error) {
        console.log(error);
        setError("Failed to load Board");
      } finally {
        setLoading(false);
      }
    }
    loadBoard();
  }, []);

  async function handleAddList(name) {
    const boardId = import.meta.env.VITE_TRELLO_BOARD_ID;
    const newList = await createList(boardId, name);
    setLists((previousLists) => [newList, ...previousLists]);
  }

  async function handleRenameList(listId, name) {
    const updatedList = await renameList(listId, name);

    setLists((previousLists) =>
      previousLists.map((list) => (list.id === listId ? updatedList : list)),
    );
  }

  async function handleDeleteList(listId) {
    await deleteList(listId);

    setLists((previousLists) =>
      previousLists.filter((list) => list.id !== listId),
    );
  }

  return (
    <Layout className="board-page">
      <Header className="board-bar">
        <Title level={4} style={{ margin: 0, color: "#fff" }}>
          trello
        </Title>
      </Header>

      <Content className="board-scroll">
        {loading && <Spin tip="Loading board..." style={{ marginTop: 40 }} />}

        {error && <Alert type="error" message={error} showIcon />}

        {!loading && !error && (
          <div className="lists-container">
            {lists.map((list) => (
              <List
                key={list.id}
                list={list}
                onRename={handleRenameList}
                onDelete={handleDeleteList}
              />
            ))}

            <AddList onAdd={handleAddList} />
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default Board;
