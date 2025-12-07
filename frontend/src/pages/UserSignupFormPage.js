import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useApiProgress } from "../shared/ApiProgress";
import { setLanguageHeader, signup } from "../api/apiCalls";
import "../css/SignupPage.css";

const regex = {
  username: /^[A-Za-z0-9]{4,16}$/,
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/,
  phone: /^\+90\s?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  taxId: /^\d{10}$/,
  reference: /^$|^[A-Za-z0-9]{1,16}$/,
};

const UserSignupFormPage = (props) => {
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({
    username: "",
    displayName: "",
    password: "",
    passwordRepeat: "",
    phoneNumber: "",
    email: "",
    address: "",
    taxId: "",
    referenceCode: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLanguageHeader(i18n.language);
  }, [i18n.language]);

  const validateField = (name, value, draft) => {
    switch (name) {
      case "username":
        if (!value) return "Kullanıcı adı zorunludur";
        if (!regex.username.test(value)) return "4-16 karakter, sadece harf ve rakam olmalı";
        return undefined;
      case "displayName":
        if (!value) return "Firma adı zorunludur";
        if (value.length > 50) return "Firma adı 50 karakteri geçemez";
        if (value.length < 2) return "Firma adı en az 2 karakter olmalı";
        return undefined;
      case "password":
        if (!value) return "Şifre zorunludur";
        if (!regex.password.test(value)) {
          return "8-16 karakter; en az 1 büyük, 1 küçük, 1 rakam ve 1 özel karakter olmalı";
        }
        return undefined;
      case "passwordRepeat":
        if (!value) return "Şifre tekrarı zorunludur";
        if (draft.password && value !== draft.password) return "Şifreler uyuşmuyor";
        return undefined;
      case "phoneNumber":
        if (!value) return "Telefon numarası zorunludur";
        if (!regex.phone.test(value)) return "Telefon numarası +90 5xx xxx xx xx formatında olmalı";
        return undefined;
      case "email":
        if (!value) return "E-posta zorunludur";
        if (!regex.email.test(value)) return "Geçerli bir e-posta girin";
        return undefined;
      case "address":
        if (!value) return "Adres zorunludur";
        if (value.length > 200) return "Adres 200 karakteri geçemez";
        return undefined;
      case "taxId":
        if (!value) return "Vergi numarası zorunludur";
        if (!regex.taxId.test(value)) return "Vergi numarası 10 haneli rakam olmalı";
        return undefined;
      case "referenceCode":
        if (!regex.reference.test(value)) return "Referans kodu harf/rakam ve en fazla 16 karakter olmalı";
        return undefined;
      default:
        return undefined;
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    setErrors((prev) => {
      const draft = { ...prev };
      const fieldError = validateField(name, value, nextForm);
      if (fieldError) draft[name] = fieldError;
      else delete draft[name];

      if (name === "password" || name === "passwordRepeat") {
        const repeatValue = name === "passwordRepeat" ? value : nextForm.passwordRepeat;
        const repeatErr = validateField("passwordRepeat", repeatValue, nextForm);
        if (repeatErr) draft.passwordRepeat = repeatErr;
        else delete draft.passwordRepeat;
      }
      return draft;
    });
  };

  const onClickSignup = async (e) => {
    e.preventDefault();
    const { passwordRepeat, ...body } = form;
    const newErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      const err = validateField(key, val, form);
      if (err) newErrors[key] = err;
    });
    if (form.password !== form.passwordRepeat) {
      newErrors.passwordRepeat = "Şifreler uyuşmuyor";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await signup(body);
      setSuccess(true);
    } catch (error) {
      if (error.response?.data?.validationErrors) {
        setErrors(error.response.data.validationErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
    }
  };

  const pendingApiCall = useApiProgress("post", "/api/1.0/users");

  const formErrors = useMemo(() => {
    const currentErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      const err = validateField(key, val, form);
      if (err) currentErrors[key] = err;
    });
    if (form.password !== form.passwordRepeat) {
      currentErrors.passwordRepeat = "Şifreler uyuşmuyor";
    }
    return currentErrors;
  }, [form]);

  const isFormValid = useMemo(() => {
    const requiredFilled =
      form.username &&
      form.displayName &&
      form.password &&
      form.passwordRepeat &&
      form.phoneNumber &&
      form.email &&
      form.address &&
      form.taxId;
    return requiredFilled && Object.keys(formErrors).length === 0;
  }, [form, formErrors]);

  return (
    <div className="signup-page">
      <div className="container">
        <div className="signup-card row align-items-stretch">
          <div className="col-12 col-lg-6 signup-intro">
            <div className="pill-soft">Topluluğa Katıl</div>
            <h2>Şimdi uygulamaya kaydolun, otoenvanter topluluğuna dahil olun</h2>
            <p className="intro-sub">
              Kayıt formunu dolduruktan sonra hesabınız 24 saat içerisinde aktif hale getirilecektir. Hesabınız aktif edildikten sonra giriş yaparak stoklarınızı yönetebilir ve sosyal akışımızı kullanabilirsiniz.
            </p>
            <ul className="intro-list">
              <li>Stoklarınızı tek panelden takip edin, tüm araçlara hızla erişin.</li>
              <li>İlanlarınızı sosyal akışta paylaşarak topluluğa ulaştırın.</li>
              <li>Ekibinizi davet edip rol bazlı yetkilendirmelerle birlikte çalışın.</li>
            </ul>
            <div className="status-note">
              <strong>Not:</strong> Kaydolduktan sonra ilk 2 ay boyunca otoenvanter'i ücretsiz kullanabilirsiniz; süre bitmeden önce plan seçerek kesintisiz devam edebilirsiniz.
            </div>
          </div>

          <div className="col-12 col-lg-6 signup-form-wrap">
            {success ? (
              <div className="signup-success">
                <h3>Başvurun alındı</h3>
                <p>
                  Hesabın oluşturuldu ve pasif durumda. Admin ekibi en geç 24 saat içinde inceleyip aktif edecek. Onay sonrasında giriş yapabilirsin.
                </p>
                <button className="btn btn-outline-light" onClick={() => props.history.push("/login")}>
                  Giriş sayfasına dön
                </button>
              </div>
            ) : (
              <form className="signup-form" onSubmit={onClickSignup} noValidate>
                <div className="signup-form__title">
                  <div className="pill-ghost">{t("Sign Up")}</div>
                  <h3>{t("Sign Up")}</h3>
                  <p className="text-muted mb-3">
                    Bilgilerini doldur, hesabın oluşturulsun. Onay sonrasında giriş yapabileceksin.
                  </p>
                </div>

                <Input
                  name="username"
                  label="Kullanıcı Adı (sadece harf/rakam, max 16)"
                  error={errors.username}
                  onChange={onChange}
                  value={form.username}
                  placeholder="örn. otoenvanter01"
                />
                <Input
                  name="displayName"
                  label="Firma Adı"
                  error={errors.displayName}
                  onChange={onChange}
                  value={form.displayName}
                  placeholder="örn. Örnek Otomotiv A.Ş."
                />
                <div className="row">
                  <div className="col-12 col-md-6">
                    <Input
                      name="password"
                      label="Şifre"
                      type="password"
                      error={errors.password}
                      onChange={onChange}
                      value={form.password}
                      placeholder="8-16 karakter, büyük/küçük harf, rakam ve özel karakter"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <Input
                      name="passwordRepeat"
                      label="Şifre Tekrar"
                      type="password"
                      error={errors.passwordRepeat}
                      onChange={onChange}
                      value={form.passwordRepeat}
                      placeholder="Şifrenizi tekrar girin"
                    />
                  </div>
                </div>
                <Input
                  name="phoneNumber"
                  label="Telefon (+90 5xx xxx xx xx)"
                  error={errors.phoneNumber}
                  onChange={onChange}
                  value={form.phoneNumber}
                  placeholder="+90 5xx xxx xx xx"
                />
                <Input
                  name="email"
                  label="E-posta"
                  error={errors.email}
                  onChange={onChange}
                  value={form.email}
                  placeholder="ornek@mail.com"
                />
                <Input
                  name="address"
                  label="Adres"
                  error={errors.address}
                  onChange={onChange}
                  value={form.address}
                  placeholder="Adresinizi yazın (en fazla 200 karakter)"
                />
                <Input
                  name="taxId"
                  label="Vergi Numarası (10 hane)"
                  error={errors.taxId}
                  onChange={onChange}
                  value={form.taxId}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="\\d{10}"
                  placeholder="10 haneli vergi numarası"
                />
                <Input
                  name="referenceCode"
                  label="Referans Kodu (isteğe bağlı)"
                  error={errors.referenceCode}
                  onChange={onChange}
                  value={form.referenceCode}
                  placeholder="Sadece harf ve rakam, max 16"
                />
                {errors.general && <div className="alert alert-danger mt-2">{errors.general}</div>}

                <div className="text-center mt-3">
                  <ButtonWithProgress
                    disabled={pendingApiCall || !isFormValid}
                    pendingApiCall={pendingApiCall}
                    text="Başvurumu Gönder"
                  />
                </div>
                <div className="signup-hint">
                  <span>Zaten hesabın var mı?</span>{" "}
                  <a href="/#/login" className="hint-link">
                    Giriş yap
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignupFormPage;
