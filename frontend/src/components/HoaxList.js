// src/components/HoaxList.js
import React, { useState, useEffect } from 'react';
import { getHoaxes, getOldHoaxes } from '../api/apiCalls';
import { useTranslation } from 'react-i18next';
import HoaxView from './HoaxView';
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';

const HoaxList = ({ refreshTrigger }) => {
  const [hoaxPage, setHoaxPage] = useState({ content: [], last: true, number: 0 });
  const { t } = useTranslation();
  const { username } = useParams();

  const path = username ? `/api/1.0/users/${username}/hoaxes?page=` : '/api/1.0/hoaxes?page=';
  const pendingApiCall = useApiProgress('get', path);

  const loadHoaxes = async (page = 0) => {
    try {
      const response = await getHoaxes(username, page);
      setHoaxPage(prev => ({
        ...response.data,
        content: page === 0 ? response.data.content : [...prev.content, ...response.data.content]
      }));
    } catch (error) {}
  };

  useEffect(() => {
    loadHoaxes(0);
  }, [username, refreshTrigger]); // ⬅️ refreshTrigger tetikler

  const loadOldHoaxes = async () => {
    const lastHoax = hoaxPage.content[hoaxPage.content.length - 1];
    if (!lastHoax) return;
    const response = await getOldHoaxes(lastHoax.id);
    setHoaxPage(prev => ({
      ...response.data,
      content: [...prev.content, ...response.data.content]
    }));
  };

  const { content, last } = hoaxPage;

  if (content.length === 0) {
    return <div className="alert alert-secondary text-center">{pendingApiCall ? <Spinner /> : t('There are no hoaxes')}</div>;
  }

  return (
    <div>
      {content.map(hoax => <HoaxView key={hoax.id} hoax={hoax} />)}
      {!last && (
        <div
          className="alert alert-secondary text-center"
          style={{ cursor: pendingApiCall ? 'not-allowed' : 'pointer' }}
          onClick={pendingApiCall ? undefined : loadOldHoaxes}
        >
          {pendingApiCall ? <Spinner /> : t('Load old hoaxes')}
        </div>
      )}
    </div>
  );
};

export default HoaxList;
