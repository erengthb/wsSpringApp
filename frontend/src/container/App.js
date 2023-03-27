import React from "react";
import ApiProgress from "../shared/ApiProgress";
import UserSignupPage from "../pages/UserSignupPage";
import LoginPage from "../pages/LoginPage";
import LanguageSelector from "../components/LanguageSelector";
function App() {
  return (
    <div className="row">
       <div className="col">
       <React.StrictMode>        
            <UserSignupPage/>            
       </React.StrictMode>          
       </div> 
       <div className="col">   
       <React.StrictMode>        
            <LoginPage/>        
       </React.StrictMode>      
       </div>
       <LanguageSelector />
    </div>
  );
}

export default App;
