import React, { useState, useEffect } from "react";
import { getHoaxes, getOldHoaxes, getOldHoaxesOfUser } from "../api/apiCalls";
import { useTranslation } from "react-i18next";
import HoaxView from "./HoaxView";
import { useApiProgress } from "../shared/ApiProgress";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import "../css/HoaxList.css";

const HoaxList = ({ refreshTrigger }) => {
  const [hoaxPage, setHoaxPage] = useState({ content: [], last: true, number: 0 });
  const { t } = useTranslation();
  const { username } = useParams();
  const isProfileView = Boolean(username);

  const path = username ? `/api/1.0/users/${username}/hoaxes?page=` : "/api/1.0/hoaxes?page=";
  const pendingApiCall = useApiProgress("get", path);

  const loadHoaxes = async (page = 0) => {
    try {
      const response = username ? await getHoaxes(username, page) : await getHoaxes(null, page);
      setHoaxPage((prev) => ({
        ...response.data,
        content:
          page === 0 ? response.data.content : [...prev.content, ...response.data.content],
      }));
    } catch {
      // no-op on load failure
    }
  };

  useEffect(() => {
    loadHoaxes(0);
  }, [username, refreshTrigger]);

  const loadOldHoaxes = async () => {
    const lastHoax = hoaxPage.content[hoaxPage.content.length - 1];
    if (!lastHoax) return;

    const response = username
      ? await getOldHoaxesOfUser(username, lastHoax.id)
      : await getOldHoaxes(lastHoax.id);

    setHoaxPage((prev) => ({
      ...response.data,
      content: [...prev.content, ...response.data.content],
    }));
  };

  const handleHoaxUpdate = (updatedHoax) => {
    setHoaxPage((prev) => ({
      ...prev,
      content: prev.content.map((item) => (item.id === updatedHoax.id ? updatedHoax : item)),
    }));
  };

  const handleHoaxDelete = (hoaxId) => {
    setHoaxPage((prev) => ({
      ...prev,
      content: prev.content.filter((item) => item.id !== hoaxId),
    }));
  };

  const { content, last } = hoaxPage;

  return (
    <div className="hoax-panel">
      {isProfileView && (
        <div className="hoax-panel__header">
          <div>
            <div className="hoax-panel__title">{t("Latest hoaxes")}</div>
            <div className="hoax-panel__subtitle">{t("Shared by you")}</div>
          </div>
          <div className="hoax-panel__count">{content.length}</div>
        </div>
      )}

      {content.length === 0 ? (
        <div className="hoax-empty">
          {pendingApiCall ? <Spinner /> : t("There are no hoaxes")}
        </div>
      ) : (
        <div className="hoax-list">
          {content.map((hoax) => (
            <HoaxView
              key={hoax.id}
              hoax={hoax}
              onUpdate={handleHoaxUpdate}
              onDelete={handleHoaxDelete}
            />
          ))}
        </div>
      )}

      {!last && (
        <div
          className={`hoax-load-more ${pendingApiCall ? "hoax-load-more--disabled" : ""}`}
          onClick={pendingApiCall ? undefined : loadOldHoaxes}
        >
          {pendingApiCall ? <Spinner /> : t("Load old hoaxes")}
        </div>
      )}
    </div>
  );
};

export default HoaxList;
