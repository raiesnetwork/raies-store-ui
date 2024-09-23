import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import "../Helpers/scss/Cart.scss";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import useMystoreStore from "../Core/Store";
import { respStoreCart } from "../Core/Interfaces";
import Header from "./Header";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa"; 

const StoreCart: React.FC = () => {
  const {
    cartData,
    cartLoader,
    setCartLoader,
    deleteCart,
    FetchToCart,
    updateCart,
  } = useMystoreStore((s) => s);

  const [cartItems, setCartItems] = useState<respStoreCart[]>(cartData);
  const [loadingItems, setLoadingItems] = useState<string[]>([]); 

  useEffect(() => {
    if (cartData) {
      setCartLoader(false);
      setCartItems(cartData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartData]);

  const getTotal = () => {
    return cartItems
      .reduce(
        (total, item) =>
          total +
          Number(item.productDetails.price) * Number(item.quantity),
        0
      )
      .toFixed(2);
  };

  const handleQuantityChange = async (
    id: string,
    newQuantity: number,
    quantity?: number,
    ProductQ?: number
  ) => {
    if ((quantity ?? 0) < (ProductQ ?? 1)) {
      setLoadingItems((prev) => [...prev, id]);
      await updateCart(id, newQuantity);
      FetchToCart();
      setLoadingItems((prev) => prev.filter((item) => item !== id)); 
    } else {
      toast.error("Item limit exceeded");
    }
  };

  const handleDeleteItem = async (id: string) => {
    const data = await deleteCart(id);
    if (data.error) {
      toast.error("Item can't be deleted");
    } else {
      toast.success("Item deleted successfully");
      FetchToCart();
    }
  };

  return (
    <>
      <Header />
      {cartLoader ? (
        <div style={{ textAlign: "center" }}>Loading...</div>
      ) : (
        <div className="cart-container">
          <h2>Your Cart</h2>
          <div className="cart-wrapper">
            <div className="cart-items">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.productDetails.id} className="cart-item">
                    <img
                      src={item.productDetails.mainImage}
                      alt="img"
                      className="item-image"
                    />
                    <div className="item-details">
                      <h3>{item.productDetails.productName}</h3>
                      <p>
                        Price:{" "}
                        {item.productDetails.currency +
                          " " +
                          item.productDetails.price}
                      </p>
                      <div className="cart-buttonss">
                        <div>
                          <label htmlFor={`quantity-${item.productDetails.id}`}>
                            Quantity:
                          </label>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.quantity > 1 && (
                              <button
                                className="quantity-btn"
                                onClick={() =>
                                  handleQuantityChange(item.id, -1, 0, 2)
                                }
                                disabled={loadingItems.includes(item.id)} 
                              >
                                {loadingItems.includes(item.id) ? ( 
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaMinus size={12} />
                                )}
                              </button>
                            )}
                            <div
                              style={{
                                padding: "10px",
                                fontSize: "15px",
                              }}
                            >
                              {item.quantity}
                            </div>
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  1,
                                  item.quantity,
                                  item.productDetails.productCount
                                )
                              }
                              disabled={loadingItems.includes(item.id)} 
                            >
                              {loadingItems.includes(item.id) ? ( 
                                <FaSpinner className="spinner" />
                              ) : (
                                <FaPlus size={12} />
                              )}
                            </button>
                          </div>
                        </div>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <MdDelete size={18} color="red" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div style={{ textAlign: "center" }}>Your Cart is empty</div>
                </>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="cart-summary">
                <h3>Total: {getTotal()}</h3>
                <Link to="/buy" state={{ details: cartItems, type: "cart" }}>
                  <button className="checkout-btn">Proceed to Checkout</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default StoreCart;
