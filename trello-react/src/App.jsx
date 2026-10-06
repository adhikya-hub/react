import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BoardsPage from "./components/BoardsPage/BoardsPage";
import Board from "./components/Board/Board";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />

        <Route path="/boards/:boardId" element={<Board />} />

        <Route path="*" element={<Navigate to="/boards" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
