import React, { useEffect, useState } from 'react';
import { getNotifications } from '../api/apiCalls';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const { username } = useSelector((store) => store); // Giriş yapan kullanıcı adı

  useEffect(() => {
    if (username) {
      getNotifications().then((res) => {
        setNotifications(res.data);
      });
    }
  }, [username]);

  if (notifications.length === 0) return null;

  return (
    <div className="dropdown">
      <i className="material-icons" style={{ cursor: 'pointer' }} data-toggle="dropdown">
        notifications
      </i>
      <div className="dropdown-menu dropdown-menu-right p-2" style={{ minWidth: '300px' }}>
        {notifications.map((n) => {
          const isCurrentUserActor = n.triggeredBy.username === username;
          const otherUser = isCurrentUserActor ? n.targetUser : n.triggeredBy;

          let message = '';
          if (n.type === 'FOLLOW') {
            message = isCurrentUserActor
              ? `You started following @${otherUser.username}`
              : `@${otherUser.username} started following you`;
          } else if (n.type === 'UNFOLLOW') {
            message = isCurrentUserActor
              ? `You unfollowed @${otherUser.username}`
              : `@${otherUser.username} unfollowed you`;
          }

          return (
            <div key={n.id} className="dropdown-item">
              <Link to={`/user/${otherUser.username}`}>
                <strong>@{otherUser.displayName || otherUser.username}</strong>
              </Link>{' '}
              <br />
              {message}
              <br />
              <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationDropdown;
