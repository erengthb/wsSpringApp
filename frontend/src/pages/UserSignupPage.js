import React from 'react';
import { signup } from '../api/apiCalls';
import Input from '../components/Input';
import {withTranslation} from 'react-i18next';

class UserSignupPage extends React.Component {
  state = {
    username: null,
    displayName: null,
    password: null,
    passwordRepeat: null,
    pendingApiCall:false,
    errors: {   }
  };

  onChange = event => {
    const{ t } = this.props;
    const { name, value } = event.target;
    const errors = {...this.state.errors};
    errors[name] = undefined 
    if(name ==='password' || name === 'passwordRepeat'){

       if(name === 'password'  && value  !== this.state.passwordRepeat){
          errors.passwordRepeat = t('Password mismatch');
       } else if (name === 'passwordRepeat' && value !==this.state.password){
          errors.passwordRepeat = t('Password mismatch');
       } else {
          errors.passwordRepeat = undefined;
       }
    }
    this.setState({
      [name]: value,
      errors
    });
  };

  onClickSignup = async event => {
    event.preventDefault();

    const { username, displayName, password } = this.state;

    const body = {
      username,
      displayName,
      password
    };
    this.setState({pendingApiCall:true})
    
     try {
       const response = await signup(body);
     }  catch(error) {
       if(error.response.data.validationErrors){
         this.setState({errors:error.response.data.validationErrors});
       }        
    }
     this.setState({pendingApiCall:false})
  };

  render() {
    const { t } = this.props
    const { pendingApiCall , errors } = this.state;
    const { username,displayName,password,passwordRepeat} = errors ;
    return ( 
      <div className="container">
        <form>
          <h1 className="text-center">{t('Sign Up')}</h1>
            
             <Input name="username" label={t("Username")} error={username} onChange={this.onChange}></Input>
             <Input name="displayName" label={t("Display Name")} error={displayName} onChange={this.onChange}></Input>
             <Input name="password" label={t("Password")} error={password} onChange={this.onChange} type="password" ></Input>
             <Input name="passwordRepeat" label={t("Password Repeat")} error={passwordRepeat} onChange={this.onChange} type="password" ></Input>

             <div className="text-center">
               <button className="btn btn-primary" onClick={this.onClickSignup} disabled={pendingApiCall || passwordRepeat !== undefined}>
               {pendingApiCall && <span className="spinner-border spinner-border-sm"></span>  } {t('Sign Up')}
               </button>
             </div>

        </form>
      </div>
    );
  }
}

const UserSignupPageWithTranslation = withTranslation()(UserSignupPage);
 
export default UserSignupPageWithTranslation ;
