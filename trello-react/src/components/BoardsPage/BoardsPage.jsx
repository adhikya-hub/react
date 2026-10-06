import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBoards } from "../../api/boardApi";
import "./BoardsPage.css";

function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBoards() {
      try {
        const data = await getBoards();
        setBoards(data);
      } catch (error) {
        console.log(error);
        setError("Failed to load boards");
      } finally {
        setLoading(false);
      }
    }

    loadBoards();
  }, []);

  if (loading) {
    return <p>Loading boards...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="boards-page">
      <h1>My Boards</h1>

      <div className="boards-container">
        {boards.map((board) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className="board-card"
          >
            <h2>{board.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BoardsPage;
