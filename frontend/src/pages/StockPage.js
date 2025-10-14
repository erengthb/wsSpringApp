import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import StockForm from "../components/StockForm";
import StockList from "../components/StockList";
import "../css/StockList.css"; // .mi helper için

const StockPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("form");
  const username = useSelector((state) => state.username);
  const history = useHistory();

  useEffect(() => {
    if (!username) {
      history.push("/");
    }
  }, [username, history]);

  return (
    <div className="container mt-4">
      <h2 className="d-flex align-items-center">
        {t("Stock Tracking")}
      </h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <span
            className={`nav-link d-inline-flex align-items-center ${
              activeTab === "form" ? "active" : ""
            }`}
            onClick={() => setActiveTab("form")}
            style={{ cursor: "pointer" }}
          >
            <span className="material-icons mi">add_circle</span>
            {t("Add Stock")}
          </span>
        </li>
        <li className="nav-item">
          <span
            className={`nav-link d-inline-flex align-items-center ${
              activeTab === "list" ? "active" : ""
            }`}
            onClick={() => setActiveTab("list")}
            style={{ cursor: "pointer" }}
          >
            <span className="material-icons mi">inventory</span>
            {t("Stock List")}
          </span>
        </li>
      </ul>

      {activeTab === "form" && <StockForm onStockAdded={() => setActiveTab("list")} />}
      {activeTab === "list" && <StockList />}
    </div>
  );
};

export default StockPage;
