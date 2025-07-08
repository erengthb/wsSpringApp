import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/hoaxify.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../redux/authActions';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { getNotifications } from '../api/apiCalls'; // 📌 API'den çekmek için

const TopBar = () => {
  const { t } = useTranslation();

  const { username, isLoggedIn, displayName, image } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
    displayName: store.displayName,
    image: store.image,
  }));

  const menuArea = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener('click', menuClickTracker);
    return () => {
      document.removeEventListener('click', menuClickTracker);
    };
  }, [isLoggedIn]);

  const menuClickTracker = (event) => {
    if (menuArea.current === null || !menuArea.current.contains(event.target)) {
      setMenuVisible(false);
      setNotificationsVisible(false);
    }
  };

  const onLogoutSuccess = () => {
    dispatch(logoutSuccess());
  };

  const toggleNotifications = async () => {
    setNotificationsVisible((prev) => !prev);
    if (!notificationsVisible) {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error('Notification fetch error', err);
      }
    }
  };

  let links = (
    <ul className="navbar-nav ml-auto">
      <li>
        <Link className="nav-link" to="/login">
          {t('Login')}
        </Link>
      </li>
      <li>
        <Link className="nav-link" to="/signup">
          {t('Sign Up')}
        </Link>
      </li>
    </ul>
  );

  if (isLoggedIn) {
    let dropDownClass = 'dropdown-menu p-0 shadow';
    if (menuVisible) {
      dropDownClass += ' show';
    }

    links = (
      <ul className="navbar-nav ml-auto" ref={menuArea}>
        <li className="nav-item dropdown">
          <div
            className="d-flex align-items-center"
            style={{ cursor: 'pointer' }}
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
              <i className="material-icons text-info mr-2">person</i>
              {t('My Profile')}
            </Link>

            <span
              className="dropdown-item d-flex p-2"
              onClick={toggleNotifications}
              style={{ cursor: 'pointer' }}
            >
              <i className="material-icons text-warning mr-2">notifications</i>
              {t('Notifications')}
            </span>

            {notificationsVisible && (
              <div className="bg-white border-top px-3 py-2">
                {notifications.length === 0 ? (
                  <div className="text-muted">{t('No notifications')}</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="small border-bottom py-1">
                      <strong>@{n.triggeredBy.username}</strong>{' '}
                      {n.type === 'FOLLOW' && t('started following you.')}
                      {n.type === 'UNFOLLOW' && t('unfollowed you.')}
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
              <i className="material-icons text-danger mr-2">power_settings_new</i>
              {t('Logout')}
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
          <img src={logo} width="60" alt="Hoaxify Logo" />
          Hoaxify
        </Link>
        {links}
      </nav>
    </div>
  );
};

export default TopBar;
