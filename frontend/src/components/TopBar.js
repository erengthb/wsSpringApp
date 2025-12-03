// src/components/TopBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, Badge, Button, Spin } from "antd";
import { BellOutlined, LogoutOutlined, UserAddOutlined, InfoCircleOutlined } from "@ant-design/icons";

import { getNotifications } from "../api/apiCalls";
import { logoutSuccess } from "../redux/authActions";
import ChangelogModal from "./ChangelogModal";
import logo from "../assets/otoenvanterlogo.jpg";
import "../css/TopBar.css";

const { Header } = Layout;

const PAYMENT_URL = "https://linkode.me/irIXqBnqD5";
const NOTIF_LIMIT = 5;

const TopBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { username, isLoggedIn, image } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
    image: store.image,
  }));

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifPage, setNotifPage] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifPanelRef = useRef(null);
  const notifTriggerRef = useRef(null);
  const lastSeenRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      setNotifPage(0);
      setNotifications([]);
      setUnreadCount(0);
      lastSeenRef.current = null;
      fetchNotifications(0);
    } else {
      setNotifications([]);
      setNotifPage(0);
      setHasMore(false);
      setUnreadCount(0);
      lastSeenRef.current = null;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!notifOpen) return;

    const handleOutsideClick = (event) => {
      if (
        notifPanelRef.current &&
        !notifPanelRef.current.contains(event.target) &&
        notifTriggerRef.current &&
        !notifTriggerRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [notifOpen]);

  const parseDate = (value) => {
    const time = value ? new Date(value).getTime() : NaN;
    return Number.isNaN(time) ? 0 : time;
  };

  const calculateUnread = (list, seenAt = lastSeenRef.current) => {
    if (!Array.isArray(list) || list.length === 0) return 0;
    if (!seenAt) return list.length;

    const seenTime = parseDate(seenAt);
    if (!seenTime) return list.length;

    return list.filter((n) => parseDate(n.createdAt) > seenTime).length;
  };

  const markNotificationsSeen = (list = notifications) => {
    const newestTime =
      list.length > 0
        ? Math.max(...list.map((n) => parseDate(n.createdAt)))
        : Date.now();
    const seenDate = new Date(newestTime || Date.now()).toISOString();

    lastSeenRef.current = seenDate;
    setUnreadCount(0);
  };

  const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleString();
  };

  const getNotificationMeta = (notif) => {
    if (notif?.type === "FOLLOW") {
      return {
        icon: <UserAddOutlined />,
        accent: "#4c6fff",
        title: t("New follower"),
      };
    }

    return {
      icon: <InfoCircleOutlined />,
      accent: "#22b8cf",
      title: t("Notifications"),
    };
  };

  const fetchNotifications = async (pageToLoad) => {
    if (notifLoading) return;
    setNotifLoading(true);
    try {
      if (pageToLoad === 0) {
        setNotifPage(0);
      }
      const res = await getNotifications(pageToLoad, NOTIF_LIMIT);
      const list = Array.isArray(res.data) ? res.data : [];
      if (pageToLoad === 0) {
        setNotifications(() => {
          setUnreadCount(calculateUnread(list));
          return list;
        });
      } else {
        setNotifications((prev) => {
          const merged = [...prev, ...list];
          setUnreadCount(calculateUnread(merged));
          return merged;
        });
      }
      setHasMore(list.length === NOTIF_LIMIT);
    } catch {
      if (pageToLoad === 0) {
        setNotifications([]);
        setUnreadCount(0);
      }
      setHasMore(false);
    } finally {
      setNotifLoading(false);
    }
  };

  const onLogout = () => {
    dispatch(logoutSuccess());
    history.push("/");
  };

  const handleNotifToggle = () => {
    const willOpen = !notifOpen;
    setNotifOpen(willOpen);
    if (willOpen) {
      markNotificationsSeen();
      fetchNotifications(0);
    }
  };

  const handleLoadMore = () => {
    const next = notifPage + 1;
    setNotifPage(next);
    fetchNotifications(next);
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to={`/user/${username}`}>{t("My Profile")}</Link>
      </Menu.Item>
      <Menu.Item key="stock">
        <Link to="/stock">{t("Stock Tracking")}</Link>
      </Menu.Item>
      <Menu.Item key="payment" onClick={() => window.open(PAYMENT_URL, "_blank")}>
        {t("Payment Link")}
      </Menu.Item>
      <Menu.Item key="changelog" onClick={() => setShowChangelog(true)}>
        {t("Changelog")}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={onLogout} icon={<LogoutOutlined />}>
        {t("Logout")}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header className="app-topbar" style={{ padding: "0 20px" }}>
        <Link to="/" className="topbar-brand">
          <img src={logo} alt="OtoEnvanter" className="topbar-logo" />
        </Link>

        <div style={{ flex: 1 }} />

        {isLoggedIn && (
          <div className="topbar-actions">
            <div ref={notifTriggerRef} className="notif-trigger" onClick={handleNotifToggle}>
              <Badge count={unreadCount} overflowCount={99} size="small">
                <BellOutlined style={{ fontSize: 20 }} />
              </Badge>
            </div>

            <Dropdown overlay={profileMenu} trigger={["click"]} placement="bottomRight">
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <Avatar src={image} size="small" />
                <span style={{ marginLeft: 8 }}>{t("My Profile")}</span>
              </div>
            </Dropdown>

            {notifOpen && (
              <div className="notif-panel" ref={notifPanelRef}>
                <div className="notif-panel__header">
                  <div>
                    <div className="notif-panel__title">{t("Notifications")}</div>
                    <div className="notif-panel__subtitle">{t("Activity updates live here")}</div>
                  </div>
                  <Button type="link" size="small" onClick={() => fetchNotifications(0)} disabled={notifLoading}>
                    {notifLoading ? <Spin size="small" /> : t("Refresh")}
                  </Button>
                </div>

                <div className="notif-panel__body">
                  {notifications.length === 0 && !notifLoading && (
                    <div className="notif-empty">
                      <InfoCircleOutlined style={{ fontSize: 18, color: "#7d8daa" }} />
                      <div className="notif-empty__title">{t("You're all caught up")}</div>
                      <div className="notif-empty__subtitle">{t("No notifications")}</div>
                    </div>
                  )}

                  {notifLoading && notifications.length === 0 && (
                    <div className="notif-loading">
                      <Spin />
                    </div>
                  )}

                  {notifications.length > 0 && (
                    <div className="notif-list">
                      {notifications.map((n) => {
                        const meta = getNotificationMeta(n);
                        return (
                          <div key={n.id} className="notif-card">
                            <div
                              className="notif-card__icon"
                              style={{
                                background: `${meta.accent}14`,
                                color: meta.accent,
                              }}
                            >
                              {meta.icon}
                            </div>
                            <div className="notif-card__content">
                              <div className="notif-card__title">{meta.title}</div>
                              <div className="notif-card__desc">
                                {n.type === "FOLLOW" && (
                                  <span>
                                    <strong>@{n.triggeredBy?.username}</strong> {t("Started follow you")}
                                  </span>
                                )}
                                {n.type !== "FOLLOW" && (n.message || t("Notifications"))}
                              </div>
                              <div className="notif-card__time">{formatDate(n.createdAt)}</div>
                            </div>
                          </div>
                        );
                      })}
                      {hasMore && (
                        <Button
                          type="default"
                          block
                          className="notif-load-more"
                          onClick={handleLoadMore}
                          disabled={notifLoading}
                        >
                          {notifLoading ? <Spin size="small" /> : t("Load more")}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Header>

      {isLoggedIn && (
        <ChangelogModal open={showChangelog} onClose={() => setShowChangelog(false)} />
      )}
    </>
  );
};

export default TopBar;


