import "./Card.css";

function Card({ card, onOpen }) {
  return (
    <div className="card" onClick={() => onOpen(card)}>
      <p className="card-name">{card.name}</p>
    </div>
  );
}

export default Card;
