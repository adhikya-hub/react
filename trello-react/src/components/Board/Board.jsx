import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  createList,
  getBoardLists,
  renameList,
  deleteList,
} from "../../api/boardApi";

import List from "../List/List";
import AddList from "../List/AddList";
import "./Board.css";

function Board() {
  const { boardId } = useParams();

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        setError("");

        const data = await getBoardLists(boardId);

        setLists(data);
      } catch (error) {
        console.log(error);
        setError("Failed to load board");
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [boardId]);

  async function handleAddList(name) {
    try {
      const newList = await createList(boardId, name);

      setLists((previousLists) => [...previousLists, newList]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRenameList(listId, name) {
    try {
      const updatedList = await renameList(listId, name);

      setLists((previousLists) =>
        previousLists.map((list) => (list.id === listId ? updatedList : list)),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteList(listId) {
    try {
      await deleteList(listId);

      setLists((previousLists) =>
        previousLists.filter((list) => list.id !== listId),
      );
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <p>Loading board...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="board-page">
      <div className="board-bar">
        <h1>Board</h1>
      </div>

      <div className="board-scroll">
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
      </div>
    </div>
  );
}

export default Board;
