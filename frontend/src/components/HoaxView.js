import React, { useEffect, useState } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { deleteHoax, updateHoax } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProgress from "./ButtonWithProgress";

const HoaxView = ({ hoax, onUpdate, onDelete }) => {
  const { user, content, timestamp, id } = hoax;
  const { username, displayName, image } = user;
  const authState = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    loggedInUsername: store.username,
  }));
  const isMine = authState.isLoggedIn && authState.loggedInUsername === username;

  const { i18n, t } = useTranslation();
  const formatted = format(timestamp, i18n.language);
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(content);
  const [validationError, setValidationError] = useState("");
  const pendingUpdate = useApiProgress("put", `/api/1.0/hoaxes/${id}`, true);
  const pendingDelete = useApiProgress("delete", `/api/1.0/hoaxes/${id}`, true);

  useEffect(() => {
    setDraftContent(content);
    setValidationError("");
  }, [content]);

  const handleSave = async () => {
    try {
      const response = await updateHoax(id, { content: draftContent });
      setIsEditing(false);
      setValidationError("");
      if (onUpdate) onUpdate(response.data);
    } catch (error) {
      const validationErrors = error.response?.data?.validationErrors;
      if (validationErrors?.content) {
        setValidationError(validationErrors.content);
      }
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(t("Are you sure you want to delete this hoax?"));
    if (!confirmed) return;
    try {
      await deleteHoax(id);
      if (onDelete) onDelete(id);
    } catch {
      // ignore errors for now; user keeps current view
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraftContent(content);
    setValidationError("");
  };

  return (
    <div className="hoax-card">
      <div className="hoax-card__top">
        <div className="hoax-card__header">
          <div className="hoax-card__avatar">
            <ProfileImageWithDefault
              image={image}
              width="36"
              height="36"
              className="rounded-circle"
            />
          </div>
          <div className="hoax-card__meta">
            <Link to={`/user/${username}`} className="hoax-card__user">
              {displayName} @{username}
            </Link>
            <span className="hoax-card__time">{formatted}</span>
          </div>
        </div>
        {isMine && (
          <div className="hoax-card__actions">
            {isEditing ? (
              <>
                <button
                  className="hoax-card__action-btn hoax-card__action-btn--ghost"
                  onClick={cancelEdit}
                  disabled={pendingUpdate}
                >
                  {t("Cancel")}
                </button>
                <ButtonWithProgress
                  className="hoax-card__action-btn hoax-card__action-btn--primary"
                  onClick={handleSave}
                  pendingApiCall={pendingUpdate}
                  disabled={pendingUpdate || !draftContent || draftContent.trim().length === 0}
                  text={t("Save")}
                />
              </>
            ) : (
              <>
                <button
                  className="hoax-card__action-btn hoax-card__action-btn--ghost"
                  onClick={() => setIsEditing(true)}
                  disabled={pendingDelete}
                >
                  {t("Edit")}
                </button>
                <ButtonWithProgress
                  className="hoax-card__action-btn hoax-card__action-btn--danger"
                  onClick={handleDelete}
                  pendingApiCall={pendingDelete}
                  disabled={pendingDelete}
                  text={t("Delete hoax")}
                />
              </>
            )}
          </div>
        )}
      </div>
      <div className="hoax-card__content">
        {isEditing ? (
          <>
            <textarea
              className={`hoax-card__textarea ${validationError ? "is-invalid" : ""}`}
              rows={3}
              value={draftContent}
              onChange={(e) => {
                setDraftContent(e.target.value);
                setValidationError("");
              }}
            />
            {validationError && <div className="invalid-feedback d-block">{validationError}</div>}
          </>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default HoaxView;
