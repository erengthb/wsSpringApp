import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import { getUser, followUser, unfollowUser, isFollowing } from '../api/apiCalls';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from '../components/Spinner';
import HoaxList from '../components/HoaxList';
import ButtonWithProgress from '../components/ButtonWithProgress';

const UserPage = () => {
  const [user, setUser] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [pendingApiCallFollow, setPendingApiCallFollow] = useState(false);

  const { username } = useParams();
  const { t } = useTranslation();

  const pendingApiCall = useApiProgress('get', '/api/1.0/users/' + username, true);

  useEffect(() => {
    setNotFound(false);
  }, [user]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUser(username);
        setUser(response.data);
        setFollowersCount(response.data.followersCount);
        setFollowingCount(response.data.followingCount);

        const isFollowingResp = await isFollowing(username);
        setIsFollowingUser(isFollowingResp.data);
      } catch (error) {
        setNotFound(true);
      }
    };
    loadUser();
  }, [username]);

  const onClickFollow = async () => {
    setPendingApiCallFollow(true);
    try {
      if (isFollowingUser) {
        await unfollowUser(username);
        setIsFollowingUser(false);
        setFollowersCount(count => count - 1);
      } else {
        await followUser(username);
        setIsFollowingUser(true);
        setFollowersCount(count => count + 1);
      }
    } catch (error) {
      console.error('Takip işlemi hatası:', error);
    }
    setPendingApiCallFollow(false);
  };

  if (notFound) {
    return (
      <div className="container">
        <div className="alert alert-danger text-center">
          <div>
            <i className="material-icons" style={{ fontSize: '48px' }}>error</i>
          </div>
          {t('User not found')}
        </div>
      </div>
    );
  }

  if (pendingApiCall || user.username !== username) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <ProfileCard user={user} />
          {user.username !== username && (
            <div style={{ marginTop: '1rem' }}>
              <ButtonWithProgress
                onClick={onClickFollow}
                disabled={pendingApiCallFollow}
                pendingApiCall={pendingApiCallFollow}
                text={isFollowingUser ? t('Unfollow') : t('Follow')}
              />
            </div>
          )}
        </div>
        <div className="col">
          <HoaxList />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
