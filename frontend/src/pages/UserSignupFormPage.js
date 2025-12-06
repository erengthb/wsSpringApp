import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useApiProgress } from "../shared/ApiProgress";
import { setLanguageHeader, signup } from "../api/apiCalls";
import "../css/SignupPage.css";

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
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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
    const { passwordRepeat, ...body } = form;
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

  const passwordRepeatError =
    form.password && form.passwordRepeat && form.password !== form.passwordRepeat
      ? t("Passwords do not match")
      : undefined;

  const pendingApiCall = useApiProgress("post", "/api/1.0/users");

  return (
    <div className="signup-page">
      <div className="container">
        <div className="signup-card row align-items-stretch">
          <div className="col-12 col-lg-6 signup-intro">
            <div className="pill-soft">Topluluğa Katıl</div>
            <h2>Hesap oluştur, incelemeye gönder</h2>
            <p className="intro-sub">
              Bilgilerini bırak, ekibimiz 24 saat içinde hesabını aktif etsin. Onay sonrası giriş yaparak stok ve sosyal
              akışı kullanabilirsin.
            </p>
            <ul className="intro-list">
              <li>Admin onayıyla güvenli erişim</li>
              <li>Telefon ve e-posta doğruluğu kontrol edilir</li>
              <li>Onaylanınca bildirimle haberdar olursun</li>
            </ul>
            <div className="status-note">
              <strong>Not:</strong> Başvurun gönderildiğinde hesabın pasif kaydedilir, admin aktif ettiğinde giriş
              yapabilirsin.
            </div>
          </div>

          <div className="col-12 col-lg-6 signup-form-wrap">
            {success ? (
              <div className="signup-success">
                <h3>Başvurun alındı</h3>
                <p>
                  Hesabın oluşturuldu ve pasif durumda. Admin ekibi en geç 24 saat içinde inceleyip aktif edecek. Onay
                  sonrasında giriş yapabilirsin.
                </p>
                <button className="btn btn-outline-light" onClick={() => props.history.push("/login")}>
                  Giriş sayfasına dön
                </button>
              </div>
            ) : (
              <form className="signup-form" onSubmit={onClickSignup}>
                <div className="signup-form__title">
                  <div className="pill-ghost">{t("Sign Up")}</div>
                  <h3>{t("Sign Up")}</h3>
                  <p className="text-muted mb-3">
                    Bilgilerini doldur, hesabın oluşturulsun. Onay sonrası giriş yapabileceksin.
                  </p>
                </div>

                <Input name="username" label={t("Username")} error={errors.username} onChange={onChange} />
                <Input name="displayName" label={t("Display Name")} error={errors.displayName} onChange={onChange} />
                <div className="row">
                  <div className="col-12 col-md-6">
                    <Input
                      name="password"
                      label={t("Password")}
                      type="password"
                      error={errors.password}
                      onChange={onChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <Input
                      name="passwordRepeat"
                      label={t("Password Repeat")}
                      type="password"
                      error={passwordRepeatError}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <Input name="phoneNumber" label={t("Phone Number")} error={errors.phoneNumber} onChange={onChange} />
                <Input name="email" label={t("Email")} error={errors.email} onChange={onChange} />
                <Input name="address" label={t("Address")} error={errors.address} onChange={onChange} />
                <Input name="taxId" label={t("Vergi Numarası")} error={errors.taxId} onChange={onChange} />
                {errors.general && <div className="alert alert-danger mt-2">{errors.general}</div>}

                <div className="text-center mt-3">
                  <ButtonWithProgress
                    disabled={pendingApiCall || !!passwordRepeatError}
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
