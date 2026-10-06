import { useState, useRef } from "react";

function App() {
  const [count, setCount] = useState(0);
  //const [by, setBy] = useState(1);
  const by = useRef(1);

  function handleClick() {
    setCount(0);
  }

  return (
    <>
      <div>
        <button
          onClick={() => setCount((prev) => prev - 1 * Number(by.current))}
        >
          -
        </button>
        <h1>{count}</h1>
        <button
          onClick={() => setCount((prev) => prev + 1 * Number(by.current))}
        >
          +
        </button>
      </div>
      <div>
        <label htmlFor="by">By</label>
        <input
          id="by"
          type="text"
          defaultValue={by.current}
          onChange={(e) => (by.current = e.target.value)}
        />
      </div>
      <button onClick={handleClick}>Reset</button>
    </>
  );
}

export default App;
