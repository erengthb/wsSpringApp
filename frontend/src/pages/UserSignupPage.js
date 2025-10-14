import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useApiProgress } from "../shared/ApiProgress";
import { useDispatch } from "react-redux";
import { signupHandler } from "../redux/authActions";
import {
  setLanguageHeader,
} from "../api/apiCalls";

const UserSignupPage = (props) => {
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    password: "",
    passwordRepeat: "",
    phoneNumber: "",
    email: "",
    taxId: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  // Backend dili header ayarı
  useEffect(() => {
    setLanguageHeader(i18n.language);
  }, [i18n.language]);

 


  const onChange = (event) => {
    const { name, value } = event.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };


 

  const onClickSignup = async (e) => {
    e.preventDefault();
    const {
      username,
      displayName,
      password,
      phoneNumber,
      email,
      address,
      taxId,
    } = form;
    const body = {
      username,
      displayName,
      password,
      phoneNumber,
      email,
      address,
      taxId,
    };

    try {
      await dispatch(signupHandler(body));
      props.history.push("/");
    } catch (error) {
      // Backend'den gelen i18n mesajlarını burada kullanıyoruz
      if (error.response?.data?.validationErrors) {
        const backendErrors = error.response.data.validationErrors;
        // Mesajları direkt olarak state'e aktar
        setErrors(backendErrors);
      }
    }
  };

  // Password frontend validation
  let passwordRepeatError;
  if (form.password !== form.passwordRepeat) {
    passwordRepeatError = t("Passwords do not match");
  }

  const pendingApiCallSignup = useApiProgress("post", "/api/1.0/users");
  const pendingApiCallLogin = useApiProgress("post", "/api/1.0/auth");
  const pendingApiCall = pendingApiCallSignup || pendingApiCallLogin;

  return (
    <div className="container">
      <form>
        <h1 className="text-center">{t("Sign Up")}</h1>

        <Input
          name="username"
          label={t("Username")}
          error={errors.username}
          onChange={onChange}
        />
        <Input
          name="displayName"
          label={t("Display Name")}
          error={errors.displayName}
          onChange={onChange}
        />
        <Input
          name="password"
          label={t("Password")}
          error={errors.password} // backend’den gelen i18n mesajı burada gösterilecek
          onChange={onChange}
          type="password"
        />
        <Input
          name="passwordRepeat"
          label={t("Password Repeat")}
          error={passwordRepeatError}
          onChange={onChange}
          type="password"
        />
        <Input
          name="phoneNumber"
          label={t("Phone Number")}
          error={errors.phoneNumber}
          onChange={onChange}
        />
        <Input
          name="email"
          label={t("Email")}
          error={errors.email}
          onChange={onChange}
        />
        <Input
          name="address"
          label={t("Address")}
          error={errors.address}
          onChange={onChange}
        />
        <Input
          name="taxId"
          label={t("Vergi Numarası")}
          error={errors.taxId}
          onChange={onChange}
        />


        <div className="text-center mt-3">
          <ButtonWithProgress
            onClick={onClickSignup}
            disabled={
              pendingApiCall ||
              passwordRepeatError !== undefined     
            }
            pendingApiCall={pendingApiCall}
            text={t("Sign Up")}
          />
        </div>
      </form>
    </div>
  );
};

export default UserSignupPage;
