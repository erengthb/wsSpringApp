import React, { useEffect, useState } from 'react';
import { getUserFollowers, getUserFollowing } from '../api/apiCalls'; // Yeni api fonksiyonlar
import ProfileImageWithDefault from './ProfileImageWithDefault';
import '../css/UserListModal.css';

const UserListModal = ({ username, type, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;

    const loadUsers = async () => {
      setLoading(true);
      try {
        let response;
        if (type === 'followers') {
          response = await getUserFollowers(username);
        } else {
          response = await getUserFollowing(username);
        }
        setUsers(response.data);
      } catch (error) {
        setUsers([]);
      }
      setLoading(false);
    };

    loadUsers();
  }, [username, type]);

  if (!username) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-wrapper" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 id="modal-title">{type === 'followers' ? 'Followers' : 'Following'}</h5>
            <button onClick={onClose} className="close-button" aria-label="Close modal">
              &times;
            </button>
          </div>

          {loading && <div className="loading-text">Loading...</div>}

          {!loading && users.length === 0 && (
            <div className="no-users-text">No users found.</div>
          )}

          <ul className="user-list">
            {users.map((user) => (
              <li key={user.username} className="user-item">
                <ProfileImageWithDefault
                  image={user.image}
                  alt={`${user.username} profile`}
                  className="rounded-circle"
                  width="50"
                  height="50"
                />
                <span className="user-text">{user.displayName} (@{user.username})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>     
    </>
  );
};

export default UserListModal;
