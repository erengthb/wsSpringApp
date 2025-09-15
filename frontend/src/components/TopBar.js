import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications } from '../api/apiCalls';
import { logoutSuccess } from '../redux/authActions';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import logo from '../assets/otoenvanterlogo.jpg';
import { Link } from 'react-router-dom';

const TopBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { username, isLoggedIn, displayName, image } = useSelector(store => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
    displayName: store.displayName,
    image: store.image,
  }));

  const menuArea = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    document.addEventListener('click', menuClickTracker);
    return () => {
      document.removeEventListener('click', menuClickTracker);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      getNotifications()
        .then(res => setNotifications(res.data))
        .catch(() => setNotifications([]));
    } else {
      setNotifications([]);
    }
  }, [isLoggedIn]);

  const menuClickTracker = (event) => {
    if (menuArea.current === null || !menuArea.current.contains(event.target)) {
      setMenuVisible(false);
      setNotificationsVisible(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationsVisible(prev => !prev);
  };

  const onLogoutSuccess = () => {
    dispatch(logoutSuccess());
  };

  // Sadece FOLLOW tipi bildirim mesajı
  const getNotificationMessage = (notification) => {
    if (notification.type === 'FOLLOW') {
      return (
        <span>
          <strong>@{notification.triggeredBy.username}</strong> {t('Started follow you')}
        </span>
      );
    }
    return '';
  };

  let links = (
    <ul className="navbar-nav ml-auto">
      <li>
        <Link className="nav-link" to="/login">{t('Login')}</Link>
      </li>
      <li>
        <Link className="nav-link" to="/signup">{t('Sign Up')}</Link>
      </li>
    </ul>
  );

  if (isLoggedIn) {
    let dropDownClass = 'dropdown-menu p-0 shadow';
    if (menuVisible) dropDownClass += ' show';

    links = (
      <ul className="navbar-nav ml-auto" ref={menuArea}>
        <li className="nav-item dropdown">
          <div
            className="d-flex align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={() => setMenuVisible(true)}
          >
            <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle m-auto" />
            <span className="nav-link dropdown-toggle">{displayName}</span>
          </div>

          <div className={dropDownClass}>
            <Link
              className="dropdown-item d-flex p-2"
              to={`/user/${username}`}
              onClick={() => setMenuVisible(false)}
            >
              <i className="material-icons text-info mr-2">person</i> {t('My Profile')}
            </Link>

            <Link
              className="dropdown-item d-flex p-2"
              to="/stock"
              onClick={() => setMenuVisible(false)}
            >
              <i className="material-icons text-primary mr-2">inventory_2</i> {t('Stock Tracking')}
            </Link>

            <span
              className="dropdown-item d-flex p-2"
              onClick={toggleNotifications}
              style={{ cursor: 'pointer' }}
            >
              <i className="material-icons text-warning mr-2">notifications</i> {t('Notifications')}
            </span>

            {notificationsVisible && (
              <div className="bg-white border-top px-3 py-2" style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div className="text-muted">{t('No notifications')}</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="small border-bottom py-1">
                      {getNotificationMessage(n)} <br />
                      <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
                    </div>
                  ))
                )}
              </div>
            )}

            <span
              className="dropdown-item d-flex p-2"
              onClick={onLogoutSuccess}
              style={{ cursor: 'pointer' }}
            >
              <i className="material-icons text-danger mr-2">power_settings_new</i> {t('Logout')}
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
    </div>
  );
};

export default TopBar;
