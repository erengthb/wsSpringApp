import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import {
  updateUser,
  followUser,
  unfollowUser,
  getUser
} from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import { updateSuccess } from '../redux/authActions';
import UserListModal from './UserListModal'; // Yeni modal component

const ProfileCard = (props) => {
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState();
  const { username: loggedInUsername } = useSelector((store) => ({ username: store.username }));
  const isLoggedIn = Boolean(loggedInUsername);
  const routeParams = useParams();
  const pathUsername = routeParams.username;
  const [user, setUser] = useState({});
  const [editable, setEditable] = useState(false);
  const [newImage, setNewImage] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [pendingFollowCall, setPendingFollowCall] = useState(false);

  // Modal kontrolü için state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'followers' veya 'following'

  useEffect(() => {
    setEditable(pathUsername === loggedInUsername);
  }, [pathUsername, loggedInUsername]);

  useEffect(() => {
    if (props.user) {
      setUser(props.user);
      setIsFollowing(props.user.following || false);
      setFollowersCount(props.user.followersCount || 0);
      setFollowingCount(props.user.followingCount || 0);
    }
  }, [props.user]);

  useEffect(() => {
    if (!pathUsername) return;
    if (props.user && props.user.username === pathUsername) return;

    const loadUser = async () => {
      try {
        const response = await getUser(pathUsername);
        setUser(response.data);
        setIsFollowing(response.data.following || false);
        setFollowersCount(response.data.followersCount || 0);
        setFollowingCount(response.data.followingCount || 0);
      } catch (error) {
        setUser({});
        setIsFollowing(false);
        setFollowersCount(0);
        setFollowingCount(0);
      }
    };

    loadUser();
  }, [pathUsername, props.user]);

  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined);
      setNewImage(undefined);
    } else {
      setUpdatedDisplayName(user.displayName);
    }
  }, [inEditMode, user.displayName]);

  useEffect(() => {
    setValidationErrors((prev) => ({ ...prev, displayName: undefined }));
  }, [updatedDisplayName]);

  useEffect(() => {
    setValidationErrors((prev) => ({ ...prev, image: undefined }));
  }, [newImage]);

  const onClickSave = async () => {
    let imageData;
    if (newImage) {
      imageData = newImage.split(',')[1];
    }

    const body = {
      displayName: updatedDisplayName,
      image: imageData,
    };
    try {
      const response = await updateUser(user.username, body);
      setInEditMode(false);

      // Veriyi tazele
      const refreshed = await getUser(user.username);
      setUser(refreshed.data);
      setIsFollowing(refreshed.data.following || false);
      setFollowersCount(refreshed.data.followersCount || 0);
      setFollowingCount(refreshed.data.followingCount || 0);

      dispatch(updateSuccess(refreshed.data));
    } catch (error) {
      setValidationErrors(error.response?.data?.validationErrors || {});
    }
  };

  const onChangeFile = (event) => {
    if (event.target.files.length < 1) return;
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const onClickFollow = async () => {
    setPendingFollowCall(true);
    try {
      await followUser(user.username);
      setIsFollowing(true);
      setFollowersCount((count) => count + 1);
    } catch (error) {}
    setPendingFollowCall(false);
  };

  const onClickUnfollow = async () => {
    setPendingFollowCall(true);
    try {
      await unfollowUser(user.username);
      setIsFollowing(false);
      setFollowersCount((count) => count - 1);
    } catch (error) {}
    setPendingFollowCall(false);
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };

  const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + user.username);
  const { displayName: displayNameError, image: imageError } = validationErrors || {};
  const isOwnProfile = isLoggedIn && user.username === loggedInUsername;

  return (
    <div className="card text-center">
      <div className="card-header">
        <ProfileImageWithDefault
          className="rounded-circle shadow"
          width="200"
          height="200"
          alt={`${user.username} profile`}
          image={user.image}
          tempimage={newImage}
        />
      </div>
      <div className="card-body">
        {!inEditMode && (
          <>
            <h3>
              {user.displayName} @{user.username}
            </h3>
            <div className="mb-3">
              <span
                className="mr-3"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal('followers')}
                data-testid="followers"
              >
                <strong>{followersCount}</strong> {t('Followers')}
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => openModal('following')}
                data-testid="following"
              >
                <strong>{followingCount}</strong> {t('Following')}
              </span>
            </div>

            {isLoggedIn && !isOwnProfile && (
              <>
                {isFollowing ? (
                  <button
                    className="btn btn-danger"
                    onClick={onClickUnfollow}
                    disabled={pendingFollowCall}
                  >
                    {pendingFollowCall && (
                      <span className="spinner-border spinner-border-sm mr-1"></span>
                    )}
                    {t('Unfollow')}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={onClickFollow}
                    disabled={pendingFollowCall}
                  >
                    {pendingFollowCall && (
                      <span className="spinner-border spinner-border-sm mr-1"></span>
                    )}
                    {t('Follow')}
                  </button>
                )}
              </>
            )}

            {editable && (
              <button
                className="btn btn-success d-inline-flex ml-2"
                onClick={() => setInEditMode(true)}
              >
                <i className="material-icons">edit</i>
                {t('Edit')}
              </button>
            )}
          </>
        )}
        {inEditMode && (
          <div>
            <Input
              label={t('Change Display Name')}
              defaultValue={user.displayName}
              onChange={(event) => {
                setUpdatedDisplayName(event.target.value);
              }}
              error={displayNameError}
            />
            <Input type="file" onChange={onChangeFile} error={imageError} />
            <div>
              <ButtonWithProgress
                className="btn btn-primary d-inline-flex"
                onClick={onClickSave}
                disabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={
                  <>
                    <i className="material-icons">save</i>
                    {t('Save')}
                  </>
                }
              />
              <button
                className="btn btn-light d-inline-flex ml-1"
                onClick={() => setInEditMode(false)}
                disabled={pendingApiCall}
              >
                <i className="material-icons">close</i>
                {t('Cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {modalVisible && (
        <UserListModal username={user.username} type={modalType} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProfileCard;
