import { Card as AntCard, Typography } from "antd";

function Card({ card, onOpen }) {
  return (
    <AntCard
      className="card"
      size="small"
      hoverable
      onClick={() => onOpen(card)}
    >
      <Typography.Text>{card.name}</Typography.Text>
    </AntCard>
  );
}

export default Card;
