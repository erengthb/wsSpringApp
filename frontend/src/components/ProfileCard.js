// src/components/ProfileCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../css/ProfileCard.css';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import { updateUser, followUser, unfollowUser, getUser } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import { updateSuccess } from '../redux/authActions';
import UserListModal from './UserListModal';
import '../css/ProfileCard.css';


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
  const [updatedAddress, setUpdatedAddress] = useState();

  // Görsel için: önizleme + gerçek dosya
  const [newImagePreview, setNewImagePreview] = useState();
  const [newImageFile, setNewImageFile] = useState(null);

  const [validationErrors, setValidationErrors] = useState({});

  const [isFollowing, setIsFollowing] = useState(user.following || false);
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0);
  const [followingCount, setFollowingCount] = useState(user.followingCount || 0);
  const [pendingFollowCall, setPendingFollowCall] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Avatar büyük önizleme modalı
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const modalBackdropRef = useRef(null);

  // “Resim Seç” butonu için gizli file input
  const fileInputRef = useRef(null);

  // Profil sahibi mi?
  const isOwnProfile = isLoggedIn && user.username === loggedInUsername;

  // Editable kontrol
  useEffect(() => {
    setEditable(pathUsername === loggedInUsername);
  }, [pathUsername, loggedInUsername]);

  // Kullanıcıyı yükle
  useEffect(() => {
    if (props.user && props.user.username === pathUsername) {
      setUser(props.user);
      setIsFollowing(props.user.following || false);
      setFollowersCount(props.user.followersCount || 0);
      setFollowingCount(props.user.followingCount || 0);
    } else if (pathUsername) {
      (async () => {
        try {
          const response = await getUser(pathUsername);
          setUser(response.data);
          setIsFollowing(response.data.following || false);
          setFollowersCount(response.data.followersCount || 0);
          setFollowingCount(response.data.followingCount || 0);
        } catch {
          setUser({});
          setIsFollowing(false);
          setFollowersCount(0);
          setFollowingCount(0);
        }
      })();
    }
  }, [pathUsername, props.user]);

  // Edit mode state ayarları
  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined);
      setUpdatedPhoneNumber(undefined);
      setUpdatedEmail(undefined);
      setUpdatedAddress(undefined);
      setNewImagePreview(undefined);
      setNewImageFile(null);
      setValidationErrors({});
    } else {
      setUpdatedDisplayName(user.displayName);
      setUpdatedPhoneNumber(user.phoneNumber || '');
      setUpdatedEmail(user.email || '');
      setUpdatedAddress(user.address || '');
    }
  }, [inEditMode, user]);

  // ESC ile image modal kapat
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setImageModalOpen(false);
    };
    if (imageModalOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [imageModalOpen]);

  const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + (user.username || ''));

  // Kaydet (PUT cevabını anında ekrana yaz)
  const onClickSave = async () => {
    const body = {
      displayName: updatedDisplayName,
      phoneNumber: updatedPhoneNumber,
      email: updatedEmail,
      address: updatedAddress,
      imageFile: newImageFile,
    };

    try {
      const res = await updateUser(user.username, body);
      const updated = res.data;
      setUser(updated);
      dispatch(updateSuccess(updated));
      setInEditMode(false);
      setNewImageFile(null);
      setNewImagePreview(undefined);
      setValidationErrors({});
    } catch (error) {
      setValidationErrors(error.response?.data?.validationErrors || {});
    }
  };

  // Dosya seçimi
  const onChangeFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setNewImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Follow/Unfollow
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
      setFollowersCount((c) => Math.max(0, c - 1));
    } catch {}
    setPendingFollowCall(false);
  };

  // Modal (followers/following list)
  const openModal = (type) => { setModalType(type); setModalVisible(true); };
  const closeModal = () => { setModalVisible(false); setModalType(null); };

  const { displayName: displayNameError, phoneNumber: phoneError, email: emailError, address: addressError } = validationErrors || {};

  // Yardımcılar
  const openImageChooser = () => fileInputRef.current?.click();
  const closeImagePreviewModal = (e) => {
    if (e.target === modalBackdropRef.current) setImageModalOpen(false);
  };

  // Büyük resimde gösterilecek kaynak (önce temp varsa onu göster)
  const bigImageSrc = newImagePreview
      ? newImagePreview
      : user.image
        ? (process.env.REACT_APP_API_URL
            ? `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/${String(user.image).replace(/^\//, '')}`
            : `/${String(user.image).replace(/^\//, '')}`)
        : null;

  return (
    <div className="card text-center">
      {/* Avatar ve başlık */}
      <div className="card-header">
        <div className="profile-avatar" role="button" title={t('Click to preview')} onClick={() => setImageModalOpen(true)}>
          <ProfileImageWithDefault
            className="rounded-circle shadow"
            width="200"
            height="200"
            alt={`${user.username} profile`}
            image={user.image}
            tempimage={newImagePreview}
          />
        </div>
        <div className="small text-muted mt-2">
          {t('Click the photo to preview')}
        </div>
      </div>

      {/* İçerik */}
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
                {user.phoneNumber && (
                  <div><strong>{t('Phone Number')}:</strong> {String(user.phoneNumber).trim()}</div>
                )}
                {user.email && (
                  <div><strong>{t('Email')}:</strong> {String(user.email).trim()}</div>
                )}
                {user.address && (
                  <div><strong>{t('Address')}:</strong> {String(user.address).trim()}</div>
                )}
                {!user.phoneNumber && !user.email && !user.address && (
                  <div className="text-muted"><em>{t('No contact information provided')}</em></div>
                )}
              </div>
            </div>

            {isLoggedIn && !isOwnProfile && (
              <>
                {isFollowing ? (
                  <button className="btn btn-danger" onClick={onClickUnfollow} disabled={pendingFollowCall}>
                    {pendingFollowCall && <span className="spinner-border spinner-border-sm mr-1" />}
                    {t('Unfollow')}
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={onClickFollow} disabled={pendingFollowCall}>
                    {pendingFollowCall && <span className="spinner-border spinner-border-sm mr-1" />}
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
              value={updatedDisplayName || ''}
              onChange={(e) => setUpdatedDisplayName(e.target.value)}
              error={displayNameError}
            />
            <Input
              label={t('Phone Number')}
              value={updatedPhoneNumber || ''}
              onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
              error={phoneError}
            />
            <Input
              label={t('Email')}
              value={updatedEmail || ''}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              error={emailError}
            />
            <Input
              label={t('Address')}
              value={updatedAddress || ''}
              onChange={(e) => setUpdatedAddress(e.target.value)}
              error={addressError}
            />

            {/* --- Profil Resmi Yükleme Bölümü --- */}
            <div className="profile-image-upload">
              <label className="d-block mb-1">{t('Upload/Edit Profile Picture')}</label>

              <div className="preview-container">
                <ProfileImageWithDefault
                  image={user.image}
                  tempimage={newImagePreview}
                  alt="Preview"
                  width="56"
                  height="56"
                  className="rounded-circle mr-3 border"
                />

                <div>
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={openImageChooser}>
                    <i className="material-icons" style={{ fontSize: 16, verticalAlign: 'middle' }}>file_upload</i>
                    <span className="ml-1">{t('Resim Seç')}</span>
                  </button>
                  <div className="help-text">
                    {t('Desteklenen formatlar')}: PNG, JPEG, WEBP — {t('Maks')} 5MB
                  </div>
                </div>
              </div>

              {/* Gizli input */}
              <input
                ref={fileInputRef}
                type="file"
                className="d-none"
                accept="image/png,image/jpeg,image/webp"
                onChange={onChangeFile}
              />
            </div>
            {/* --- /Profil Resmi Yükleme Bölümü --- */}

            <div className="mt-2">
              <ButtonWithProgress
                className="btn btn-primary d-inline-flex"
                onClick={onClickSave}
                disabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={<><i className="material-icons">save</i> {t('Save')}</>}
              />
              <button
                className="btn btn-light d-inline-flex ml-1"
                onClick={() => setInEditMode(false)}
                disabled={pendingApiCall}
              >
                <i className="material-icons">close</i> {t('Cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {modalVisible && (
        <UserListModal username={user.username} type={modalType} onClose={closeModal} />
      )}

      {/* Avatar büyük önizleme modalı */}
      {imageModalOpen && bigImageSrc && (
        <div
          className="image-preview-backdrop"
          ref={modalBackdropRef}
          onClick={closeImagePreviewModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="image-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="image-preview-close">
              <button
                className="btn btn-sm btn-light"
                onClick={() => setImageModalOpen(false)}
                aria-label={t('Close modal')}
              >
                &times;
              </button>
            </div>
            <img alt="profile-large" src={bigImageSrc} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
