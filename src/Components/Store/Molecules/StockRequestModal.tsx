import React, { useState } from "react";
import { Modal, Form, Button, Spinner, Alert } from "react-bootstrap";
import useMystoreStore from "../Core/Store";

const StockRequestModal: React.FC = () => {
  const { singleProductData, isOpenBiddingModal, setOpenBiddingModal } = useMystoreStore((state) => state);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [expectedDate, setExpectedDate] = useState("");
  const [advancePayment, setAdvancePayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const productCost = singleProductData?.price || 0;
  const totalStockCost = stockQuantity * productCost;

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  // Validation Function
  const validateForm = () => {
    if (stockQuantity < 1) {
      setError("Stock quantity must be at least 1.");
      return false;
    }
    if (!expectedDate) {
      setError("Please select the expected date.");
      return false;
    }
    if (expectedDate < getTomorrowDate()) {
      setError("Expected date cannot be today or a past date.");
      return false;
    }
    setError(""); // Clear errors if everything is valid
    return true;
  };

  const handleStockRequest = () => {
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenBiddingModal();
      alert("Stock request placed successfully!");
    }, 2000);
  };

  return (
    <Modal show={isOpenBiddingModal} onHide={setOpenBiddingModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Request For Stock</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>} {/* Show Error Message */}

        <Form>
          {/* Product Name */}
          <Form.Group className="mb-3">
            <Form.Label><strong>Product Name</strong></Form.Label>
            <Form.Control type="text" value={singleProductData?.productName || ""} readOnly />
          </Form.Group>

          {/* Number of Stock Requests */}
          <Form.Group className="mb-3">
            <Form.Label><strong>Number of Stock Requests</strong></Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              isInvalid={stockQuantity < 1}
            />
            <Form.Control.Feedback type="invalid">Must be at least 1.</Form.Control.Feedback>
          </Form.Group>

          {/* Expected Date */}
          <Form.Group className="mb-3">
            <Form.Label><strong>Stock Expected Date</strong></Form.Label>
            <Form.Control
              type="date"
              value={expectedDate}
              min={getTomorrowDate()} // Prevents past & today’s dates
              onChange={(e) => setExpectedDate(e.target.value)}
            //@ts-ignore
              isInvalid={expectedDate && expectedDate < getTomorrowDate()}
            />
            <Form.Control.Feedback type="invalid">Select a future date (not today or before).</Form.Control.Feedback>
          </Form.Group>

          {/* Calculated Stock Cost */}
          <Form.Group className="mb-3">
            <Form.Label><strong>Stock Cost (Exclusive of Tax & Delivery)</strong></Form.Label>
            <Form.Control type="text" value={`₹${totalStockCost}`} readOnly />
          </Form.Group>

          {/* Advance Payment Option */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label={<strong>Advance Payment</strong>}
              checked={advancePayment}
              onChange={(e) => setAdvancePayment(e.target.checked)}
            />
          </Form.Group>

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={handleStockRequest} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Place Stock Request"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StockRequestModal;
