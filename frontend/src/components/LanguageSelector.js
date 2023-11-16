import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../api/apiCalls';

const LanguageSelector = (props) => {
  const { i18n } = useTranslation();

  const onChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    changeLanguage(language);
  };

  return (
    <div className="container">
      <div
        className="flag-container"
        onClick={() => onChangeLanguage('tr')}
        style={{ display: 'inline-block', marginRight: '10px' }}
      >
        <img
          src="https://flagcdn.com/w20/tr.png"
          srcSet="https://flagcdn.com/w40/tr.png 2x"
          width="20"
          alt="Turkey"
          style={{ cursor: 'pointer' }}
        ></img>
      </div>
      <div className="flag-container" onClick={() => onChangeLanguage('en')} style={{ display: 'inline-block', marginRight: '10px' }}>
        <img
          src="https://flagcdn.com/w20/us.png"
          srcSet="https://flagcdn.com/w40/us.png 2x"
          width="20"
          alt="United States"
          style={{ cursor: 'pointer' }}
        ></img>
      </div>
    </div>
  );
};

export default LanguageSelector;
