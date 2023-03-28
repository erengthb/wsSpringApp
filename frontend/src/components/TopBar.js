import React, { Component } from 'react';
import logo from '../assets/hoaxify.png';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { signup } from '../api/apiCalls';

class TopBar extends Component {

    state = {
        isLoggedIn : true ,
        username   : 'eren',
    }

    render() {
        const {t} = this.props;
        const {isLoggedIn,username} = this.state;

        let links = (
            <ul className="navbar-nav ml-auto">
                  <Link className='nav-link' to="/login">                 
                         {t('Login')}                      
                  </Link>
                  <Link className='nav-link' to="/signup">                       
                         {t('Sign Up')}                          
                  </Link>
            </ul>
        );

        if(isLoggedIn){
            links = (
                <ul className="navbar-nav ml-auto">
                    <li> 
                        <Link className='nav-link' to={`/user/${username}`}> 
                        {username}
                        </Link>                       
                    </li> 
                    <li className='nav-link'> {t('Logout')} </li> 
                </ul>
            );
        }
        
        return (
            <div className="shadow-sm bg-light mb-2">               
                <nav className="navbar navbar-light  container navbar-expand">
                   <Link className="navbar-brand" to="/">
                   <img src = {logo}  width = "60" alt ="Hoaxify Logo"></img>
                    Hoaxify
                    </Link>
                    {links}
                </nav>
            </div>
        );
    }
}

export default withTranslation()(TopBar);