import React from 'react';
import UserSignupPage from '../pages/UserSignupPage';
import LoginPage from '../pages/LoginPage';
import LanguageSelector from '../components/LanguageSelector';
import Homepage from '../pages/Homepage';
import UserPage from '../pages/UserPage';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useSelector } from 'react-redux';
import StockPage from '../pages/StockPage';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import UserSignupFormPage from '../pages/UserSignupFormPage';

const App = () => {
  const { isLoggedIn } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
  }));

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Router>
        <TopBar />
        <div className="content-wrap" style={{ flex: 1 }}>
          <Switch>
            <Route exact path="/" component={Homepage} />
            {!isLoggedIn && <Route path="/login" component={LoginPage} />}
            <Route path="/signup" component={UserSignupPage} />
             {/*  <Route path="/signup" component={UserSignupFormPage} />  */}
            <Route path="/user/:username" component={UserPage} />
            <Route path="/stock" component={StockPage} />
            <Redirect to="/" />
          </Switch>
        </div>

        <LanguageSelector />
        <WhatsAppButton />
        <Footer />
      </Router>
    </div>
  );
};


export default App;
