import React from "react";
import UserSignupPage from "../pages/UserSignupPage";
import LoginPage from "../pages/LoginPage";
import LanguageSelector from "../components/LanguageSelector";
import Homepage from "../pages/Homepage";
import UserPage from "../pages/UserPage";
import {HashRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import TopBar from "../components/TopBar";
import { useSelector } from "react-redux";

const  App = () => {

  const {isLoggedIn} = useSelector((store) => ({
    isLoggedIn : store.isLoggedIn
  }))
  
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

export default App;
