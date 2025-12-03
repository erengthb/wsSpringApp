import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useApiProgress } from "../shared/ApiProgress";
import { useDispatch } from "react-redux";
import { loginHandler } from "../redux/authActions";
import { FiCheckCircle, FiShield, FiLogIn, FiPackage } from "react-icons/fi";
import { getStatsOverview } from "../api/apiCalls";
import "../css/LoginPage.css";

const STATS_CACHE_KEY = "otoenvanter-stats";
const STATS_CACHE_TTL = 24 * 60 * 60 * 1000;

const readCachedStats = () => {
  try {
    const raw = localStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.cachedAt === "number" && parsed.data) {
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
};

const saveCachedStats = (data) => {
  try {
    localStorage.setItem(
      STATS_CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now(),
        data,
      })
    );
  } catch {
    // storage might be unavailable; fail silently
  }
};

const formatCount = (value) => {
  if (value === null || value === undefined) return "0";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "0";
  return numericValue.toLocaleString("tr-TR");
};

const LoginPage = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [stats, setStats] = useState({
    userCount: null,
    hoaxCount: null,
    stockCount: null,
  });

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    setError(undefined);
  }, [username, password]);

  useEffect(() => {
    const cached = readCachedStats();
    if (cached?.data) {
      setStats({
        userCount: cached.data.userCount ?? 0,
        hoaxCount: cached.data.hoaxCount ?? 0,
        stockCount: cached.data.stockCount ?? 0,
      });
    }

    const isFresh = cached && Date.now() - cached.cachedAt < STATS_CACHE_TTL;
    if (isFresh) return;

    const loadStats = async () => {
      try {
        const res = await getStatsOverview();
        const payload = res.data || {};
        const data = {
          userCount:
            Number(payload.userCount ?? payload.totalUsers ?? payload.userTotal ?? 0) || 0,
          hoaxCount:
            Number(payload.hoaxCount ?? payload.totalHoax ?? payload.hoaxTotal ?? 0) || 0,
          stockCount:
            Number(
              payload.stockCount ?? payload.totalStock ?? payload.totalStocks ?? payload.stockTotal ?? 0,
            ) || 0,
        };
        setStats(data);
        saveCachedStats(data);
      } catch {
        if (cached?.data) {
          setStats({
            userCount: cached.data.userCount ?? 0,
            hoaxCount: cached.data.hoaxCount ?? 0,
            stockCount: cached.data.stockCount ?? 0,
          });
        }
      }
    };

    loadStats();
  }, []);

  const onClickLogin = async (event) => {
    event.preventDefault();
    const creds = { username, password };

    const { history } = props;
    const { push } = history;

    setError(undefined);
    try {
      await dispatch(loginHandler(creds));
      push("/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || t("Load Failure"));
    }
  };

  const pendingApiCall = useApiProgress("post", "/api/1.0/auth");
  const buttonEnabled = username && password;

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card row align-items-stretch">
          <div className="col-12 col-lg-6 login-intro">
            <div className="pill-soft">
              <FiShield />
              <span>Güvenli giriş</span>
            </div>
            <h2>Panonuza giriş yapın</h2>
            <p className="intro-sub">
              Stok ve hoax akışınızı tek panelden yönetin. Takip ettiğiniz firmalardan anında haberdar
              olun.
            </p>
            <ul className="intro-list">
              <li>
                <FiCheckCircle />
                <span>Rol bazlı yetkilendirme ve log kayıtları</span>
              </li>
              <li>
                <FiCheckCircle />
                <span>Gerçek zamanlı bildirim ve takip akışı</span>
              </li>
              <li>
                <FiCheckCircle />
                <span>Stok giriş-çıkış ve hoax paylaşımlarını hızla yönet</span>
              </li>
            </ul>
            <div className="intro-stat">
              <div>
                <div className="eyebrow">Aktif kullanıcı</div>
                <strong>{formatCount(stats.userCount)}</strong>
              </div>
              <div>
                <div className="eyebrow">Hoax sayısı</div>
                <strong>{formatCount(stats.hoaxCount)}</strong>
              </div>
              <div>
                <div className="eyebrow">Toplam stok</div>
                <strong>
                  <FiPackage style={{ marginRight: 6 }} />
                  {formatCount(stats.stockCount)}
                </strong>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 login-form-wrap">
            <form className="login-form" onSubmit={onClickLogin}>
              <div className="login-form__title">
                <div className="pill-ghost">
                  <FiLogIn />
                  <span>{t("Login")}</span>
                </div>
                <h3>{t("Login")}</h3>
                <p className="text-muted mb-3">
                  Hoax akışına ve stok yönetimine erişmek için bilgilerinizi girin.
                </p>
              </div>

              <Input
                label={t("Username")}
                onChange={(event) => setUsername(event.target.value)}
              />
              <Input
                label={t("Password")}
                type="password"
                onChange={(event) => setPassword(event.target.value)}
              />
              {error && <div className="alert alert-danger mt-2">{error}</div>}
              <div className="text-center mt-3">
                <ButtonWithProgress
                  disabled={!buttonEnabled || pendingApiCall}
                  pendingApiCall={pendingApiCall}
                  text={t("Login")}
                />
              </div>
              <div className="login-hint">
                <span>Hesabın yok mu?</span>{" "}
                <a href="/#/signup" className="hint-link">
                  Kayıt ol
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
