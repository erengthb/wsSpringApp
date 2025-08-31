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


const App = () => {
  const { isLoggedIn } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
  }));

  return (
    <div>
      <Router>
        <TopBar />
        <Switch>
          <Route exact path="/" component={Homepage} />
          {!isLoggedIn && <Route path="/login" component={LoginPage} />}
          <Route exact path="/" component={Homepage} />
          {!isLoggedIn && <Route path="/login" component={LoginPage} />}
          
          {/* signup yönlendirme 
          <Route
            path="/signup"
            component={() => {
              window.location.href =
                "https://docs.google.com/forms/u/0/d/13PPn_0TIcgp4D_Xq0sIlD3W3xo9kZk5Dt4NsAtj2N-Q/preview";
              return null;
            }}
          />*/}
              <Route path="/signup" component={UserSignupPage} /> 
          <Route path="/user/:username" component={UserPage} />
          <Route path="/stock" component={StockPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
      <LanguageSelector />
         {/* ✅ WhatsApp Butonu her sayfada sağ altta gözükecek */}
         <WhatsAppButton />
    </div>
  );
};

export default App;
