import React from "react";
import ApiProgress from "../shared/ApiProgress";
import UserSignupPage from "../pages/UserSignupPage";
import LoginPage from "../pages/LoginPage";
import LanguageSelector from "../components/LanguageSelector";
import Homepage from "../pages/Homepage";
import UserPage from "../pages/UserPage";

function App() {
  return (
    <div className="row">
      <UserPage></UserPage>
       <LanguageSelector />
    </div>
  );
}

export default App;
