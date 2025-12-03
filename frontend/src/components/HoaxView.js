import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";

const HoaxView = ({ hoax }) => {
  const { user, content, timestamp } = hoax;
  const { username, displayName, image } = user;

  const { i18n } = useTranslation();
  const formatted = format(timestamp, i18n.language);

  return (
    <div className="hoax-card">
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
      <div className="hoax-card__content">{content}</div>
    </div>
  );
};

export default HoaxView;
