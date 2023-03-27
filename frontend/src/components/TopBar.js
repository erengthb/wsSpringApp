import React, { Component } from 'react';
import logo from '../assets/hoaxify.png';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { signup } from '../api/apiCalls';

class TopBar extends Component {
    render() {

        const {t} = this.props;

        return (
            <div className="shadow-sm bg-light mb-2">               
                <nav className="navbar navbar-light  container navbar-expand">
                   <Link className="navbar-brand" to="/">
                   <img src = {logo}  width = "60" alt ="Hoaxify Logo"></img>
                    Hoaxify
                    </Link>
                    <ul className="navbar-nav ml-auto">
                         <Link className='nav-link' to="/login">                 
                            {t('Login')}                      
                          </Link>
                         <Link className='nav-link' to="/signup">                       
                            {t('Sign Up')}                          
                         </Link>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default withTranslation()(TopBar);