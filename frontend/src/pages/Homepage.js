import React, { useState } from 'react';
import UserList from '../components/UserList';
import HoaxSubmit from '../components/HoaxSubmit';
import { useSelector } from 'react-redux';
import HoaxList from '../components/HoaxList';

const HomePage = () => {
  const { isLoggedIn } = useSelector(store => ({ isLoggedIn: store.isLoggedIn }));

  // Refresh tetikleyici state
  const [refreshCounter, setRefreshCounter] = useState(0);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {isLoggedIn && (
            <div className="mb-1">
              <HoaxSubmit onSuccess={() => setRefreshCounter(prev => prev + 1)} />
            </div>
          )}
          <HoaxList refreshTrigger={refreshCounter} />
        </div>
        <div className="col">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
