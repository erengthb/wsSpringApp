import React, { useState, useEffect } from 'react';
import { getHoaxes } from '../api/apiCalls';
import { useTranslation } from 'react-i18next';
import HoaxView from './HoaxView';
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';

const HoaxList = () => {
  const [hoaxPage, setHoaxPage] = useState({ content: [], last: true, number: 0 });
  const { t } = useTranslation();
  const { username } = useParams();

  const path = username ? `/api/1.0/users/${username}/hoaxes?page=` : '/api/1.0/hoaxes?page=';
  const pendingApiCall = useApiProgress('get', path);

  useEffect(() => {
    loadHoaxes();
  }, []);

  const loadHoaxes = async page => {
    try {
      const response = await getHoaxes(username, page);
      setHoaxPage(previousHoaxPage => ({
        ...response.data,
        content: [...previousHoaxPage.content, ...response.data.content]
      }));
    } catch (error) {}
  };

  const { content, last, number } = hoaxPage;

  if (content.length === 0) {
    return <div className="alert alert-secondary text-center">{pendingApiCall ? <Spinner /> : t('There are no hoaxes')}</div>;
  }

  return (
    <div>
      {content.map(hoax => {
        return <HoaxView key={hoax.id} hoax={hoax} />;
      })}
      {!last && (
        <div
          className="alert alert-secondary text-center"
          style={{ cursor: pendingApiCall ? 'not-allowed' : 'pointer' }}
          onClick={pendingApiCall ? () => {} : () => loadHoaxes(number + 1)}
        >
          {pendingApiCall ? <Spinner /> : t('Load old hoaxes')}
        </div>
      )}
    </div>
  );
};

export default HoaxList;