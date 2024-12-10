import React, { useState } from "react";
import Menu from "./Menu/Menu";
import Orders from "./Orders/Orders";
import CreateOrder from "./CreateOrder/CreateOrder";

const App = () => {
  const [view, setView] = useState("menu"); // State mit useState-Hook

  return (
    <div>
      <header id="header">
        <div className="header-items">
          <button className="header-item" onClick={() => setView("orders")}>
            Orders
          </button>
          <button className="header-item" onClick={() => setView("menu")}>
            Menu
          </button>
          <button
            className="header-item"
            onClick={() => setView("createOrder")}
          >
            Create Order
          </button>
        </div>
      </header>
      <div id="main">
        {view === "orders" && <Orders />}
        {view === "menu" && <Menu setView={setView} />}
        {view === "createOrder" && <CreateOrder />}
      </div>
    </div>
  );
};

export default App;
