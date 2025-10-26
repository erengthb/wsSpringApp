// src/components/TopBar.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, Badge, Button, Modal, Spin, Divider } from "antd";
import { BellOutlined, UserOutlined, LogoutOutlined, GiftOutlined, StockOutlined, SyncOutlined } from "@ant-design/icons";

import { getNotifications } from "../api/apiCalls";
import { logoutSuccess } from "../redux/authActions";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import ChangelogModal from "./ChangelogModal";
import PaymentLinkPreviewModal from "./PaymentLinkPreviewModal";
import logo from "../assets/otoenvanterlogo.jpg";

const { Header } = Layout;

const PAYMENT_URL = "https://linkode.me/irIXqBnqD5";
const NOTIF_LIMIT = 3;

const TopBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { username, isLoggedIn, displayName, image } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
    displayName: store.displayName,
    image: store.image,
  }));

  const [notifications, setNotifications] = useState([]);
  const [notifPage, setNotifPage] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [showChangelog, setShowChangelog] = useState(false);
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setNotifPage(0);
      setNotifications([]);
      fetchNotifications(0);
    } else {
      setNotifications([]);
      setNotifPage(0);
      setHasMore(false);
    }
  }, [isLoggedIn]);

  const fetchNotifications = async (pageToLoad) => {
    if (notifLoading) return;
    setNotifLoading(true);
    try {
      const res = await getNotifications(pageToLoad, NOTIF_LIMIT);
      const list = Array.isArray(res.data) ? res.data : [];
      if (pageToLoad === 0) setNotifications(list);
      else setNotifications((prev) => [...prev, ...list]);
      setHasMore(list.length === NOTIF_LIMIT);
    } catch {
      if (pageToLoad === 0) setNotifications([]);
      setHasMore(false);
    } finally {
      setNotifLoading(false);
    }
  };

  const onLogout = () => dispatch(logoutSuccess());

  const notifMenu = (
    <div style={{ maxHeight: 300, overflowY: "auto", minWidth: 250 }}>
      {notifications.length === 0 ? (
        <div className="text-center p-2">
          {notifLoading ? <Spin size="small" /> : t("No notifications")}
        </div>
      ) : (
        <>
          {notifications.map((n) => (
            <div key={n.id} className="p-2 border-bottom">
              {n.type === "FOLLOW" && (
                <span>
                  <strong>@{n.triggeredBy.username}</strong> {t("Started follow you")}
                </span>
              )}
              <br />
              <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          ))}
          {hasMore && (
            <Button
              type="link"
              block
              onClick={() => {
                const next = notifPage + 1;
                setNotifPage(next);
                fetchNotifications(next);
              }}
            >
              {notifLoading ? <Spin size="small" /> : t("Daha fazla yükle")}
            </Button>
          )}
        </>
      )}
    </div>
  );

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to={`/user/${username}`}>{t("My Profile")}</Link>
      </Menu.Item>
      <Menu.Item key="stock">
        <Link to="/stock">{t("Stock Tracking")}</Link>
      </Menu.Item>
      <Menu.Item key="payment" onClick={() => setShowPaymentPreview(true)}>
        {t("Ödeme Linki")}
      </Menu.Item>
      <Menu.Item key="changelog" onClick={() => setShowChangelog(true)}>
        {t("Güncelleme Notları")}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={onLogout} icon={<LogoutOutlined />}>
        {t("Logout")}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          background: "#fff",
          boxShadow: "0 2px 8px #f0f1f2",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo" style={{ height: 40 }} />
        </Link>

        <div style={{ flex: 1 }} /> {/* Boşluk */}

        {!isLoggedIn && (
          <Link to="/" style={{ marginLeft: "auto" }}>
            {t("Anasayfa")}
          </Link>
        )}

        {isLoggedIn && (
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <Dropdown overlay={notifMenu} trigger={['click']} placement="bottomRight">
              <Badge count={notifications.length} overflowCount={99}>
                <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
              </Badge>
            </Dropdown>

            <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <Avatar src={image} size="small" />
                <span style={{ marginLeft: 8 }}>{displayName}</span>
              </div>
            </Dropdown>
          </div>
        )}
      </Header>

      {isLoggedIn && (
        <ChangelogModal open={showChangelog} onClose={() => setShowChangelog(false)} />
      )}

      {isLoggedIn && (
        <PaymentLinkPreviewModal
          open={showPaymentPreview}
          onClose={() => setShowPaymentPreview(false)}
          url={PAYMENT_URL}
          title="Ödeme Linki Önizleme"
        />
      )}
    </>
  );
};

export default TopBar;
