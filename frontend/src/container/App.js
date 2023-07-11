import React from "react";
import UserSignupPage from "../pages/UserSignupPage";
import LoginPage from "../pages/LoginPage";
import LanguageSelector from "../components/LanguageSelector";
import Homepage from "../pages/Homepage";
import UserPage from "../pages/UserPage";
import {HashRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import TopBar from "../components/TopBar";
import { connect } from "react-redux";

class App extends React.Component {
  render( ){

    const {isLoggedIn} = this.props;
    
     return (
       <div >
           <Router>
             <TopBar></TopBar>
              <Switch>
                  <Route exact path="/" component={Homepage} ></Route>

                  { !isLoggedIn &&
                    <Route path="/login" component={LoginPage} ></Route>                     
                  }
                  
                  <Route path="/signup" component={UserSignupPage} ></Route>

                  <Route path="/user/:username" component={UserPage} ></Route>

                  <Redirect to = "/"></Redirect>  

              </Switch>      
           </Router>   
       <LanguageSelector />
       </div>
     );
  }
}

const mapStateToProps = store => {
  return {
    isLoggedIn: store.isLoggedIn,
  };
};

export default connect(mapStateToProps)(App);
