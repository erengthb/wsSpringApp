import Input from '../components/Input';
import { useTranslation } from 'react-i18next';
import { withApiProgress } from '../shared/ApiProgress';
import { useDispatch } from 'react-redux';
import { loginHandler } from '../redux/authActions';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { useEffect, useState } from 'react';

const  LoginPage = (props) =>  {

    const [username , setUsername] =  useState();
    const [password , setPassword] =  useState();
    const [error    , setError   ] =  useState();

    const dispatch = useDispatch();


    useEffect(() =>{
     setError(undefined);
    } , [username,password]);
    
    const   onClickLogin = async  event => {
      event.preventDefault();
      const creds = {
        username : username,
        password : password
      };
      const { history } = props;
      const { push } = history; 
      setError(undefined);
      try {    
        await  dispatch(loginHandler(creds))
        push('/') 
      }      
      catch (apiError) {          
       setError(apiError.response.data.message)
      } 
    }
    
    const { t } = useTranslation();
    const { pendingApiCall } = props;
    const buttonEnabled = username && password;

        return (
            <div>               
                <div className = "container">
                   <form>
                    <h1 className="text-center">{t('Login')} </h1>
                    <Input label = {t('Username')}   onChange = {event =>setUsername(event.target.value)}> </Input>
                    <Input label = {t('Password')}   onChange = {event =>setPassword(event.target.value)}  type="password"></Input>
                    {error && <div className="alert alert-danger" role="alert"> {error}</div>}
                        <div className="text-center">
                            <ButtonWithProgress onClick={onClickLogin} 
                            disabled={!buttonEnabled || pendingApiCall} 
                            pendingApiCall = {pendingApiCall} 
                            text = {t('Login')} > </ButtonWithProgress>
                        </div>
                   </form>
                </div>
            </div>
        );
}

export default withApiProgress(LoginPage, '/api/1.0/auth');