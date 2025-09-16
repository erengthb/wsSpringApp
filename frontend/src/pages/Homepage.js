import React, { useState } from 'react';
import UserList from '../components/UserList';
import HoaxSubmit from '../components/HoaxSubmit';
import HoaxList from '../components/HoaxList';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import '../css/Footer.css';

const GuestHomepage = () => {
  const { t } = useTranslation();

  return (
    <div className="container guest-home py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 text-center">
          <h1 className="mb-4">Oto Envanter</h1>
          <p className="lead">{t("welcomeMessage")}</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Link to="/login" className="btn btn-primary btn-lg">{t("login")}</Link>
            <Link to="/signup" className="btn btn-outline-primary btn-lg">{t("signup")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { isLoggedIn } = useSelector(store => ({ isLoggedIn: store.isLoggedIn }));
  const [refreshCounter, setRefreshCounter] = useState(0);

  if (!isLoggedIn) return <GuestHomepage />;

  return (
    <div className="container main-home py-3">
      <div className="row">
        <div className="col-12 col-lg-8 mb-3">
          <div className="mb-1">
            <HoaxSubmit onSuccess={() => setRefreshCounter(prev => prev + 1)} />
          </div>
          <HoaxList refreshTrigger={refreshCounter} />
        </div>
        <div className="col-12 col-lg-4">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
