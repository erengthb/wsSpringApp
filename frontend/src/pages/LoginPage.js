import React, { Component } from 'react';
import Input from '../components/Input';
import { withTranslation} from 'react-i18next';
import { withApiProgress } from '../shared/ApiProgress';
import { connect } from 'react-redux';
import { loginHandler } from '../redux/authActions';

import ButtonWithProgress from '../components/ButtonWithProgress';
class LoginPage extends Component {

 // static contextType = Authentication;

    state = {
        username:null,
        password:null,
        error:null
       
    }

    onChange = event => {

        const { name , value} = event.target;
        this.setState({
            [name]: value,
            error : null
        });
    };
    
    onClickLogin =async  event => {
      event.preventDefault();
     
      const { username,password} = this.state;
      
      const creds = {
        username : username,
        password : password
      };

      const {history ,dispatch} = this.props;
      const { push } = this.props.history;

      this.setState({
        error:null
      })

      try {    
        await  dispatch(loginHandler(creds))
        push('/') 
      }      
      catch (apiError) {          
         this.setState({
             error:apiError.response.data.message
         });

      } 
    }
    
    render() {
        const {t , pendingApiCall} = this.props
        const {username , password , error } = this.state;
        const buttonEnabled = username && password;
        return (
            <div>               
                <div className = "container">
                   <form>
                    <h1 className="text-center">{t('Login')} </h1>
                    <Input label = {t('Username')}  name = "username" onChange = {this.onChange}></Input>
                    <Input label = {t('Password')} name = "password" onChange = {this.onChange}  type="password"></Input>
                    {error && <div className="alert alert-danger" role="alert"> {error}</div>}
                        <div className="text-center">
                            <ButtonWithProgress onClick={this.onClickLogin} disabled={!buttonEnabled || pendingApiCall} pendingApiCall = {pendingApiCall} text = {t('Login')} > </ButtonWithProgress>
                        </div>
                   </form>
                </div>
            </div>
        );
    }
}

const LoginPageWithTranslation = withTranslation()(LoginPage);
const LoginPageWithApiProgress = withApiProgress(LoginPageWithTranslation,'/api/1.0/auth');


export default connect ()(LoginPageWithApiProgress);