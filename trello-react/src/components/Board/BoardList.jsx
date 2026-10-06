function BoardList({ boards, selectedBoardId, onSelect }) {
  return (
    <div>
      <h2>Boards</h2>

      {boards.map((board) => (
        <button
          key={board.id}
          onClick={() => onSelect(board)}
          style={{
            fontWeight: board.id === selectedBoardId ? "bold" : "normal",
          }}
        >
          {board.name}
        </button>
      ))}
    </div>
  );
}

export default BoardList;
