import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Orders.css";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const handlePriceFilterChange = (value) => {
    setPriceFilter(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const filteredOrders = orders
    ? orders.filter(
        (order) =>
          (order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.littleDisc
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) &&
          (priceFilter === "" ||
            priceFilter === 0 ||
            (order.price !== 0 &&
              parseInt(order.price) <= parseInt(priceFilter))) &&
          (categoryFilter === "" || order.category === categoryFilter)
      )
    : [];

  useEffect(() => {
    try {
      axios
        .get("http://localhost:5000/get_orders")
        .then((response) => {
          setOrders(response.data.data);
          console.log("Order Loaded:", response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log("Orders konnten nicht geladen werden!", error);
    }
  }, []);

  return (
    <div>
      <div id="screachMenu">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchInput"
        />
      </div>
      <div id="filterMenu">
        <h2>Max Price: {priceFilter === "" ? "0" : priceFilter}$</h2>
        <Slider
          min={0}
          max={100}
          value={priceFilter === "" ? 0 : parseInt(priceFilter)}
          onChange={handlePriceFilterChange}
          className="filterMenu-items"
        />
        <h2>Categories</h2>
        <select
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          id="categorySelect"
        >
          <option value="">All</option>
          <option value="Hausarbeit">Hausarbeit</option>
          <option value="Umzug">Umzug</option>
          <option value="Einkaufen">Einkaufen</option>
          <option value="Gartenarbeit">Gartenarbeit</option>
          <option value="Reparatur">Reparatur</option>
          <option value="Reinigung">Reinigung</option>
          <option value="Tiere">Tiere</option>
          <option value="Nachhilfe">Nachhilfe</option>
        </select>
      </div>
      <div id="orderContainer">
        <div className="orderContainer">
          {filteredOrders.map((item) => (
            <div
              key={item._id}
              onClick={() => handleProductClick(item)}
              className="item"
            >
              <div className="item-content">
                <p>
                  <b>{item.name}</b>
                </p>
                <p>{item.title}</p>
              </div>

              {item.image && (
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.title}
                />
              )}

              <p className="price">
                <b>{item.price}$</b>
              </p>
            </div>
          ))}
          {showModal && selectedProduct && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <h2>{selectedProduct.name}</h2>
                <br />
                <img
                  src={`data:image/jpeg;base64,${selectedProduct.image}`}
                  alt=""
                />
                <br />
                <p className="disc">{selectedProduct.description}</p>
                <br />
                <p className="price">
                  <b>{selectedProduct.price}$</b>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
