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

const ProfileCard = (props) => {
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState();
  const { username: loggedInUsername } = useSelector((store) => ({ username: store.username }));
  const routeParams = useParams();
  const pathUsername = routeParams.username;
  const [user, setUser] = useState({});
  const [editable, setEditable] = useState(false);
  const [newImage, setNewImage] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Takip durumu ve takipçi sayıları
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Takip / Takipten çık API çağrılarının durumu
  const [pendingFollowCall, setPendingFollowCall] = useState(false);

  // Editable mi?
  useEffect(() => {
    setEditable(pathUsername === loggedInUsername);
  }, [pathUsername, loggedInUsername]);

  // props.user değiştiğinde user state'i güncelleniyor (sende zaten var)
  useEffect(() => {
    if (props.user) {
      setUser(props.user);
      setIsFollowing(props.user.isFollowing || false);
      setFollowersCount(props.user.followersCount || 0);
      setFollowingCount(props.user.followingCount || 0);
    }
  }, [props.user]);

  // Eğer pathUsername varsa ve props.user yoksa (veya pathUsername değiştiyse)
  // kullanıcı bilgisini backend'den çek
  useEffect(() => {
    if (!pathUsername) return;
    if (props.user && props.user.username === pathUsername) return; // Zaten elimizde var, tekrar çekme

    const loadUser = async () => {
      try {
        const response = await getUser(pathUsername);
        setUser(response.data);
        setIsFollowing(response.data.isFollowing || false);
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

  // Edit moduna geçişte displayName ve image resetle
  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined);
      setNewImage(undefined);
    } else {
      setUpdatedDisplayName(user.displayName);
    }
  }, [inEditMode, user.displayName]);

  // DisplayName ve image alanlarındaki validation errorları temizle
  useEffect(() => {
    setValidationErrors((prev) => ({ ...prev, displayName: undefined }));
  }, [updatedDisplayName]);

  useEffect(() => {
    setValidationErrors((prev) => ({ ...prev, image: undefined }));
  }, [newImage]);

  // Save butonu
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
      setUser(response.data);
      dispatch(updateSuccess(response.data));
    } catch (error) {
      setValidationErrors(error.response.data.validationErrors);
    }
  };

  const onChangeFile = (event) => {
    if (event.target.files.length < 1) {
      return;
    }
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  // Takip etme fonksiyonu
  const onClickFollow = async () => {
    setPendingFollowCall(true);
    try {
      await followUser(user.username);
      setIsFollowing(true);
      setFollowersCount((count) => count + 1);
    } catch (error) {
      // Hata yönetimi isteğe bağlı
    }
    setPendingFollowCall(false);
  };

  // Takipten çıkma fonksiyonu
  const onClickUnfollow = async () => {
    setPendingFollowCall(true);
    try {
      await unfollowUser(user.username);
      setIsFollowing(false);
      setFollowersCount((count) => count - 1);
    } catch (error) {
      // Hata yönetimi isteğe bağlı
    }
    setPendingFollowCall(false);
  };

  // Put request için progress hook
  const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + user.username);

  const { displayName: displayNameError, image: imageError } = validationErrors;

  const isOwnProfile = user.username === loggedInUsername;

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

            {/* Takipçi ve takip edilen sayıları */}
            <div className="mb-3">
              <span className="mr-3">
                <strong>{followersCount}</strong> {t('followers')}
              </span>
              <span>
                <strong>{followingCount}</strong> {t('following')}
              </span>
            </div>

            {/* Takip et / takipten çık butonu, kendi profilinde gösterme */}
            {!isOwnProfile && (
              <>
                {isFollowing ? (
                  <button
                    className="btn btn-danger"
                    onClick={onClickUnfollow}
                    disabled={pendingFollowCall}
                  >
                    {pendingFollowCall && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    {t('Unfollow')}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={onClickFollow}
                    disabled={pendingFollowCall}
                  >
                    {pendingFollowCall && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    {t('Follow')}
                  </button>
                )}
              </>
            )}

            {/* Düzenleme butonu */}
            {editable && (
              <button className="btn btn-success d-inline-flex ml-2" onClick={() => setInEditMode(true)}>
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
    </div>
  );
};

export default ProfileCard;
