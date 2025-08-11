import React from "react";
import "../../Helpers/scss/QuantityControl.scss";

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 100,
}) => {
  return (
    <div className="quantity-control">
      <button 
        onClick={onDecrement} 
        disabled={quantity <= min}
        className="quantity-btn"
      >
        -
      </button>
      <span className="quantity-value">{quantity}</span>
      <button 
        onClick={onIncrement} 
        disabled={quantity >= max}
        className="quantity-btn"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;