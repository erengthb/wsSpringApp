// src/components/TopBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { getNotifications } from "../api/apiCalls";
import { logoutSuccess } from "../redux/authActions";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import ChangelogModal from "./ChangelogModal";
import logo from "../assets/otoenvanterlogo.jpg";

const TopBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { username, isLoggedIn, displayName, image } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
    displayName: store.displayName,
    image: store.image,
  }));

  const menuArea = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // notifications + pagination
  const [notifications, setNotifications] = useState([]);
  const [notifPage, setNotifPage] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false); // <— son fetch limit kadar mı geldi?
  const NOTIF_LIMIT = 3// <— İSTEDİĞİN DEĞER

  // changelog modal
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    document.addEventListener("click", menuClickTracker);
    return () => document.removeEventListener("click", menuClickTracker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      // ilk sayfa
      setNotifPage(0);
      setNotifications([]);
      setHasMore(false);
      fetchNotifications(0);
    } else {
      setNotifications([]);
      setNotifPage(0);
      setHasMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const fetchNotifications = async (pageToLoad) => {
    if (notifLoading) return;
    setNotifLoading(true);
    try {
      const res = await getNotifications(pageToLoad, NOTIF_LIMIT);
      const list = Array.isArray(res.data) ? res.data : [];
      if (pageToLoad === 0) {
        setNotifications(list);
      } else {
        setNotifications((prev) => [...prev, ...list]);
      }
      // “daha fazla”yı sadece list uzunluğu limit’e eşitse açık tut
      setHasMore(list.length === NOTIF_LIMIT);
    } catch {
      if (pageToLoad === 0) setNotifications([]);
      setHasMore(false);
    } finally {
      setNotifLoading(false);
    }
  };

  const menuClickTracker = (event) => {
    if (menuArea.current === null || !menuArea.current.contains(event.target)) {
      setMenuVisible(false);
      setNotificationsVisible(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationsVisible((prev) => !prev);
  };

  const onLogoutSuccess = () => {
    dispatch(logoutSuccess());
  };

  const getNotificationMessage = (notification) => {
    if (notification.type === "FOLLOW") {
      return (
        <span>
          <strong>@{notification.triggeredBy.username}</strong>{" "}
          {t("Started follow you")}
        </span>
      );
    }
    return "";
  };

  let links = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/">
          {t("Anasayfa")}
        </Link>
      </li>
    </ul>
  );

  if (isLoggedIn) {
    let dropDownClass = "dropdown-menu p-0 shadow";
    if (menuVisible) dropDownClass += " show";

    links = (
      <ul className="navbar-nav ml-auto" ref={menuArea}>
        <li className="nav-item dropdown">
          <div
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setMenuVisible(true)}
          >
            <ProfileImageWithDefault
              image={image}
              width="32"
              height="32"
              className="rounded-circle m-auto"
            />
            <span className="nav-link dropdown-toggle">{displayName}</span>
          </div>

          <div className={dropDownClass}>
            <Link
              className="dropdown-item d-flex p-2"
              to={`/user/${username}`}
              onClick={() => setMenuVisible(false)}
            >
              <i className="material-icons text-info mr-2">person</i>{" "}
              {t("My Profile")}
            </Link>

            <Link
              className="dropdown-item d-flex p-2"
              to="/stock"
              onClick={() => setMenuVisible(false)}
            >
              <i className="material-icons text-primary mr-2">inventory_2</i>{" "}
              {t("Stock Tracking")}
            </Link>

            <span
              className="dropdown-item d-flex p-2"
              onClick={toggleNotifications}
              style={{ cursor: "pointer" }}
            >
              <i className="material-icons text-warning mr-2">notifications</i>{" "}
              {t("Notifications")}
            </span>

            {notificationsVisible && (
              <div
                className="bg-white border-top px-3 py-2"
                style={{ maxHeight: 300, overflowY: "auto" }}
              >
                {notifications.length === 0 ? (
                  <div className="text-muted">
                    {notifLoading ? t("Loading...") : t("No notifications")}
                  </div>
                ) : (
                  <>
                    {notifications.map((n) => (
                      <div key={n.id} className="small border-bottom py-1">
                        {getNotificationMessage(n)} <br />
                        <small className="text-muted">
                          {new Date(n.createdAt).toLocaleString()}
                        </small>
                      </div>
                    ))}

                    {hasMore && (
                      <button
                        className="btn btn-link btn-sm w-100"
                        disabled={notifLoading}
                        onClick={() => {
                          const next = notifPage + 1;
                          setNotifPage(next);
                          fetchNotifications(next);
                        }}
                      >
                        {notifLoading ? t("Loading...") : t("Daha fazla yükle")}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            <span
              className="dropdown-item d-flex p-2"
              onClick={() => {
                setShowChangelog(true);
                setMenuVisible(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <i className="material-icons text-info mr-2">update</i> Güncelleme
              Notları
            </span>

            <span
              className="dropdown-item d-flex p-2"
              onClick={onLogoutSuccess}
              style={{ cursor: "pointer" }}
            >
              <i className="material-icons text-danger mr-2">
                power_settings_new
              </i>{" "}
              {t("Logout")}
            </span>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <div className="shadow-sm bg-light mb-2">
      <nav className="navbar navbar-light container navbar-expand">
        <Link className="navbar-brand" to="/">
          <img src={logo} width="100" alt="Oto Envanter Logo" />
        </Link>
        {links}
      </nav>

      {isLoggedIn && (
        <ChangelogModal
          open={showChangelog}
          onClose={() => setShowChangelog(false)}
        />
      )}
    </div>
  );
};

export default TopBar;
