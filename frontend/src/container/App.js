import React from "react";
import ApiProgress from "../shared/ApiProgress";
import UserSignupPage from "../pages/UserSignupPage";
import LoginPage from "../pages/LoginPage";
import LanguageSelector from "../components/LanguageSelector";
import Homepage from "../pages/Homepage";
import UserPage from "../pages/UserPage";
import {HashRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import TopBar from "../components/TopBar";

class App extends React.Component {

  state = {
    isLoggedIn : false ,
    username   : undefined
  }

  onLoginSuccess = (username) => {
  
   this.setState({    
     username,
     isLoggedIn:true

   })
}

  onLogoutSuccess = () => {

    this.setState({
     isLoggedIn:false,
     username:undefined
    })
}

  render( ){

    const { isLoggedIn,username} = this.state;

     return (
       <div >
           <Router>
             <TopBar username={username} isLoggedIn= {isLoggedIn}  onLogoutSuccess = {this.onLogoutSuccess} ></TopBar>
              <Switch>
                  <Route exact path="/" component={Homepage} ></Route>

                  { !isLoggedIn &&
                    <Route path="/login" component={(props) => {     
                    return <LoginPage {...props}  onLoginSuccess={this.onLoginSuccess} ></LoginPage>
                  }} ></Route>                     
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

export default App;
