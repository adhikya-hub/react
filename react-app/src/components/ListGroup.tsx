import { MouseEvent } from "react";
import { useState } from "react";

function ListGroup() {
  const items = ["a", "b", "c", "d", "e"];
  //items = [];
  const [selectedIndex, setSelectedIndex] = useState(-1);

  function handleClick(event: MouseEvent) {
    selectedIndex = console.log(event);
  }
  return (
    <>
      <h1>List</h1>
      <ul className="list-group">
        {items.length == 0 && <p>No Item found</p>}
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
