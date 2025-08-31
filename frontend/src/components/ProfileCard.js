import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import { updateUser, followUser, unfollowUser, getUser } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import { updateSuccess } from '../redux/authActions';
import UserListModal from './UserListModal';

const ProfileCard = (props) => {
  const { username: loggedInUsername } = useSelector((store) => ({ username: store.username }));
  const isLoggedIn = Boolean(loggedInUsername);
  const routeParams = useParams();
  const pathUsername = routeParams.username;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [user, setUser] = useState(props.user || {});
  const [editable, setEditable] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState();
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState();
  const [updatedEmail, setUpdatedEmail] = useState();
  const [newImage, setNewImage] = useState();
  const [validationErrors, setValidationErrors] = useState({});

  const [isFollowing, setIsFollowing] = useState(user.following || false);
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0);
  const [followingCount, setFollowingCount] = useState(user.followingCount || 0);
  const [pendingFollowCall, setPendingFollowCall] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Editable kontrol
  useEffect(() => {
    setEditable(pathUsername === loggedInUsername);
  }, [pathUsername, loggedInUsername]);

  // Kullanıcıyı yükle (props.user varsa onu kullan, yoksa backend’den çek)
  useEffect(() => {
    if (props.user && props.user.username === pathUsername) {
      setUser(props.user);
      setIsFollowing(props.user.following || false);
      setFollowersCount(props.user.followersCount || 0);
      setFollowingCount(props.user.followingCount || 0);
    } else if (pathUsername) {
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
    }
  }, [pathUsername, props.user]);

  // Edit mode state ayarları
  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined);
      setUpdatedPhoneNumber(undefined);
      setUpdatedEmail(undefined);
      setNewImage(undefined);
    } else {
      setUpdatedDisplayName(user.displayName);
      setUpdatedPhoneNumber(user.phoneNumber || '');
      setUpdatedEmail(user.email || '');
    }
  }, [inEditMode, user]);

  useEffect(() => setValidationErrors((prev) => ({ ...prev, displayName: undefined })), [updatedDisplayName]);
  useEffect(() => setValidationErrors((prev) => ({ ...prev, image: undefined })), [newImage]);
  useEffect(() => setValidationErrors((prev) => ({ ...prev, phoneNumber: undefined })), [updatedPhoneNumber]);
  useEffect(() => setValidationErrors((prev) => ({ ...prev, email: undefined })), [updatedEmail]);

  const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + user.username);
  const { displayName: displayNameError, image: imageError, phoneNumber: phoneError, email: emailError } = validationErrors || {};
  const isOwnProfile = isLoggedIn && user.username === loggedInUsername;

  // Save handler
  const onClickSave = async () => {
    let imageData;
    if (newImage) {
      imageData = newImage.split(',')[1];
    }

    const body = {
      displayName: updatedDisplayName,
      phoneNumber: updatedPhoneNumber,
      email: updatedEmail,
      image: imageData
    };

    try {
      await updateUser(user.username, body);
      setInEditMode(false);
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
    if (!event.target.files[0]) return;
    const fileReader = new FileReader();
    fileReader.onloadend = () => setNewImage(fileReader.result);
    fileReader.readAsDataURL(event.target.files[0]);
  };

  const onClickFollow = async () => {
    setPendingFollowCall(true);
    try {
      await followUser(user.username);
      setIsFollowing(true);
      setFollowersCount((c) => c + 1);
    } catch {}
    setPendingFollowCall(false);
  };

  const onClickUnfollow = async () => {
    setPendingFollowCall(true);
    try {
      await unfollowUser(user.username);
      setIsFollowing(false);
      setFollowersCount((c) => c - 1);
    } catch {}
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
        {!inEditMode ? (
          <>
            <h3>{user.displayName} @{user.username}</h3>
            <div className="mb-3">
              <span className="mr-3" style={{ cursor: 'pointer' }} onClick={() => openModal('followers')}>
                <strong>{followersCount}</strong> {t('Followers')}
              </span>
              <span style={{ cursor: 'pointer' }} onClick={() => openModal('following')}>
                <strong>{followingCount}</strong> {t('Following')}
              </span>
              <div className="mt-2 text-left">
                <div>
                  <strong>{t('Phone Number')}:</strong> {user.phoneNumber?.trim() || t('Not Provided')}
                </div>
                <div>
                  <strong>{t('Email')}:</strong> {user.email?.trim() || t('Not Provided')}
                </div>
              </div>
            </div>

            {isLoggedIn && !isOwnProfile && (
              <>
                {isFollowing ? (
                  <button className="btn btn-danger" onClick={onClickUnfollow} disabled={pendingFollowCall}>
                    {pendingFollowCall && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    {t('Unfollow')}
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={onClickFollow} disabled={pendingFollowCall}>
                    {pendingFollowCall && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    {t('Follow')}
                  </button>
                )}
              </>
            )}

            {editable && (
              <button className="btn btn-success d-inline-flex ml-2" onClick={() => setInEditMode(true)}>
                <i className="material-icons">edit</i> {t('Edit')}
              </button>
            )}
          </>
        ) : (
          <div>
            <Input
              label={t('Change Display Name')}
              defaultValue={user.displayName}
              onChange={(e) => setUpdatedDisplayName(e.target.value)}
              error={displayNameError}
            />
            <Input
              label={t('Phone Number')}
              value={updatedPhoneNumber}
              onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
              error={phoneError}
            />
            <Input
              label={t('Email')}
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              error={emailError}
            />
            <Input type="file" onChange={onChangeFile} error={imageError} />
            <div>
              <ButtonWithProgress
                className="btn btn-primary d-inline-flex"
                onClick={onClickSave}
                disabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={<><i className="material-icons">save</i> {t('Save')}</>}
              />
              <button className="btn btn-light d-inline-flex ml-1" onClick={() => setInEditMode(false)} disabled={pendingApiCall}>
                <i className="material-icons">close</i> {t('Cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {modalVisible && <UserListModal username={user.username} type={modalType} onClose={closeModal} />}
    </div>
  );
};

export default ProfileCard;
