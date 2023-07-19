import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../api/apiCalls';

const LanguageSelector = (props) => {

  const {i18n} = useTranslation();

  const  onChangeLanguage = language => {
        i18n.changeLanguage(language);
        changeLanguage(language);
    };

    return (
        <div className="container">
            <img
              src="https://www.countryflagicons.com/FLAT/24/TR.png"
              alt="Turkish Flag"
              onClick={() => onChangeLanguage('tr')}
              style={{ cursor: 'pointer' }}
            ></img>
            <img
              src="https://www.countryflagicons.com/FLAT/24/GB.png"
              alt="USA Flag"
              onClick={() => onChangeLanguage('en')}
              style={{ cursor: 'pointer' }}
            ></img>
          </div>
    );
};

export default LanguageSelector;