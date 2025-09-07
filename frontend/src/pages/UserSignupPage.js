import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { useApiProgress } from '../shared/ApiProgress';
import { useDispatch } from 'react-redux';
import { signupHandler } from '../redux/authActions';
import { requestCaptcha, verifyCaptcha } from '../api/apiCalls';

const UserSignupPage = (props) => {
  const [form, setForm] = useState({
    username: null,
    displayName: null,
    password: null,
    passwordRepeat: null,
    phoneNumber: null,
    email: null,
    taxId: null,
  });

  const [captchaId, setCaptchaId] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const loadCaptcha = async () => {
    try {
      const response = await requestCaptcha();
      setCaptchaId(response.data.captchaId);
      setCaptchaImage(response.data.captchaImage);
      setCaptchaInput('');
      setIsCaptchaVerified(false);
      setCaptchaError('');
    } catch (error) {
      setCaptchaError(t('Failed to load CAPTCHA'));
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onCaptchaInputChange = (e) => {
    setCaptchaInput(e.target.value);
    setCaptchaError('');
  };

  const onVerifyCaptcha = async () => {
    try {
      await verifyCaptcha(captchaId, captchaInput);
      setIsCaptchaVerified(true);
      setCaptchaError('');
    } catch (err) {
      setCaptchaError(t('Invalid CAPTCHA input'));
      setIsCaptchaVerified(false);
    }
  };

  const onClickSignup = async (e) => {
    e.preventDefault();
    const { username, displayName, password, phoneNumber, email, taxId } = form;

    const body = {
      username,
      displayName,
      password,
      phoneNumber,
      email,
      taxId,
      captchaId,
      captchaInput
    };

    try {
      await dispatch(signupHandler(body));
      props.history.push('/');
    } catch (error) {
      if (error.response?.data?.validationErrors) {
        setErrors(error.response.data.validationErrors);
      }
    }
  };

  // Hatalı destructuring düzeltilmiş
  const { 
    username: usernameError, 
    displayName: displayNameError, 
    password: passwordError, 
    phoneNumber: phoneError, 
    email: emailError, 
    taxId: taxError 
  } = errors || {};

  const pendingApiCallSignup = useApiProgress('post', '/api/1.0/users');
  const pendingApiCallLogin = useApiProgress('post', '/api/1.0/auth');
  const pendingApiCall = pendingApiCallSignup || pendingApiCallLogin;

  let passwordRepeatError;
  if (form.password !== form.passwordRepeat) {
    passwordRepeatError = t('Password mismatch');
  }

  return (
    <div className="container">
      <form>
        <h1 className="text-center">{t('Sign Up')}</h1>
        <Input name="username" label={t('Username')} error={usernameError} onChange={onChange} />
        <Input name="displayName" label={t('Display Name')} error={displayNameError} onChange={onChange} />
        <Input name="password" label={t('Password')} error={passwordError} onChange={onChange} type="password" />
        <Input name="passwordRepeat" label={t('Password Repeat')} error={passwordRepeatError} onChange={onChange} type="password" />
        <Input name="phoneNumber" label={t('Phone Number')} error={phoneError} onChange={onChange} />
        <Input name="email" label={t('Email')} error={emailError} onChange={onChange} />
        <Input name="taxId" label={t('Tax ID')} error={taxError} onChange={onChange} />

        <div className="form-group">
          <label>{t('CAPTCHA')}:</label>
          <div className="captcha-image-container mb-2">
            {captchaImage && <img src={captchaImage} alt="captcha" />}
            <button type="button" className="btn btn-link btn-sm" onClick={loadCaptcha} disabled={pendingApiCall}>
              {t('Reload CAPTCHA')}
            </button>
          </div>
          <input
            className="form-control"
            value={captchaInput}
            onChange={onCaptchaInputChange}
            disabled={isCaptchaVerified}
            placeholder={t('Enter CAPTCHA text')}
          />
          <button
            className="btn btn-secondary mt-2"
            onClick={onVerifyCaptcha}
            type="button"
            disabled={isCaptchaVerified || !captchaInput}
          >
            {t('Verify CAPTCHA')}
          </button>
          {captchaError && <div className="text-danger mt-2">{captchaError}</div>}
          {isCaptchaVerified && <div className="text-success mt-2">{t('CAPTCHA verified')}</div>}
        </div>

        <div className="text-center mt-3">
          <ButtonWithProgress
            onClick={onClickSignup}
            disabled={pendingApiCall || passwordRepeatError !== undefined || !isCaptchaVerified}
            pendingApiCall={pendingApiCall}
            text={t('Sign Up')}
          />
        </div>
      </form>
    </div>
  );
};

export default UserSignupPage;
