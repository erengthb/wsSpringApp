import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiUsers, FiLifeBuoy } from "react-icons/fi";
import UserManagementPanel from "./UserManagementPanel";
import SupportTicketsAdmin from "./SupportTicketsAdmin";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const history = useHistory();
  const { isLoggedIn, username } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
  }));
  const isAdmin = isLoggedIn && username === "admin";
  const [activeMenu, setActiveMenu] = useState("users");

  useEffect(() => {
    if (!isAdmin) {
      history.push("/");
    }
  }, [isAdmin, history]);

  const menu = [
    { key: "users", label: "Kullanıcı İşlemleri", icon: <FiUsers /> },
    { key: "support", label: "Destek Talepleri", icon: <FiLifeBuoy /> },
  ];

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="pill pill-soft">Yönetim</div>
          <h4>Kontrol Paneli</h4>
        </div>
        <nav className="admin-nav">
          {menu.map((item) => (
            <button
              key={item.key}
              className={`admin-nav__item ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => setActiveMenu(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        {activeMenu === "users" && <UserManagementPanel />}
        {activeMenu === "support" && <SupportTicketsAdmin />}
      </main>
    </div>
  );
};

export default AdminDashboard;
