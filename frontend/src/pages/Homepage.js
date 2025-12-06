// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import HoaxSubmit from "../components/HoaxSubmit";
import HoaxList from "../components/HoaxList";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FiTrendingUp,
  FiSmartphone,
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiPackage,
  FiMessageSquare,
} from "react-icons/fi";
import { getStatsOverview } from "../api/apiCalls";
import Tabs from "../components/Tabs";
import "../css/Footer.css";
import "../css/HomeTabs.css"; // küçük stil iyileştirmeleri için
import "../css/GuestHomepage.css";

const STATS_CACHE_KEY = "otoenvanter-stats";
const STATS_CACHE_TTL = 24 * 60 * 60 * 1000; // 1 gün

const readCachedStats = () => {
  try {
    const raw = localStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.cachedAt === "number" && parsed.data) return parsed;
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
      }),
    );
  } catch {
    // ignore
  }
};

const formatCount = (value) => {
  if (value === null || value === undefined) return "0";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "0";
  return numericValue.toLocaleString("tr-TR");
};

const GuestHomepage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ userCount: null, hoaxCount: null, stockCount: null });

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

  const highlights = [
    { label: "Stok yönetimi", value: "Gerçek zamanlı görünürlük" },
    { label: "Sosyal akış", value: "Hoax paylaşımlarıyla iletişim" },
    { label: "Takip & bildirim", value: "Güvenilir firmalarla anında temas" },
  ];

  const features = [
    {
      icon: <FiTrendingUp />,
      title: "Stok Yönetimi Modülü",
      desc: "Yedek parçaları kaydedin, giriş-çıkış yapın, azalan stokları görün, eksikleri zamanında tamamlayın.",
    },
    {
      icon: <FiSmartphone />,
      title: "Sosyal Medya Modülü (Hoax)",
      desc: "Hoax paylaşımlarıyla ihtiyacınızı duyurun veya elinizdeki ürünleri sergileyin; ortak akışta herkes görsün.",
    },
    {
      icon: <FiUsers />,
      title: "Takip ve İletişim",
      desc: "Güvendiğiniz firmaları takip edin, paylaşımlarından bildirim alın, mesajlaşma ve bildirim altyapısıyla işi hızlandırın.",
    },
    {
      icon: <FiShield />,
      title: "Geliştirilecek Özellikler",
      desc: "Fiyat/satış takibiyle kâr/zarar raporları, seviye altı stok uyarıları, gelişmiş arama/filtreleme ve puanlama.",
    },
  ];

  const steps = [
    {
      title: "Kaydol",
      desc: "Hesabınızı açın, ekip rollerini tanımlayın.",
    },
    {
      title: "Stoklarını İçeri Al",
      desc: "Ürünlerinizi ekleyin, giriş/çıkış işlemlerini başlatın, hoax paylaşımlarıyla duyurun.",
    },
    {
      title: "Takip Et ve İşbirliği Yap",
      desc: "Firmaları takip edin, bildirimlerle haberdar olun, iletişim kurup stoğu güvenceye alın.",
    },
  ];

  const checklist = [
    "Azalan stok uyarılarıyla aksiyon alın",
    "Giriş-çıkış kayıtlarını tek panelden yönetin",
    "Hoax paylaşımlarıyla ihtiyacınızı duyurun",
    "Takip ve bildirimle güvenilir ağ kurun",
  ];

  const statCards = [
    { label: "Aktif kullanıcı", value: stats.userCount, icon: <FiUsers /> },
    { label: "Toplam hoax", value: stats.hoaxCount, icon: <FiMessageSquare /> },
    { label: "Toplam stok", value: stats.stockCount, icon: <FiPackage /> },
  ];

  return (
    <div className="guest-homepage">
      <section className="hero container">
        <div className="row align-items-center gy-4">
          <div className="col-lg-7">
            <div className="pill">
              OtoEnvanter · Oto yedek parça ve servis ağı için sosyal + stok
            </div>
            <h1 className="hero-title">
              Oto yedek parça ve servis ağı için stok + sosyal ağ tek panelde.
            </h1>
            <p className="hero-subtitle">
              Otoenvanter.com, oto yedek parça satıcıları ve servis ağı için geliştirilen web
              tabanlı sosyal medya + stok takip platformudur. Her cihazdan giriş yapın,
              stoklarınızı yönetin, sektörle iletişimde kalın.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">
                {t("signup")}
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">
                {t("login")}
              </Link>
            </div>
            <div className="highlights">
              {highlights.map((item) => (
                <div key={item.label} className="highlight-item">
                  <span className="highlight-label">{item.label}</span>
                  <strong className="highlight-value">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="hero-card">
              <div className="hero-card__header">
                <div>
                  <p className="eyebrow">Canlı pano</p>
                  <h3>Aksiyon alınabilir görünürlük</h3>
                </div>
                <div className="badge-soft">İlk 2 ay ücretsiz</div>
              </div>
              <ul className="checklist">
                {checklist.map((text) => (
                  <li key={text}>
                    <FiCheckCircle />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="hero-card__footer">
                <div>
                  <p className="small text-muted mb-1">Dakikalar içinde kurulum</p>
                  <strong>Destek ekibi yanınızda</strong>
                </div>
                <Link to="/login" className="text-link">
                  Giriş yap ve incele
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats container">
        <div className="section-header">
          <span className="pill pill-ghost">Topluluk verisi</span>
          <h2>Canlı göstergeler</h2>
          <p className="section-subtitle">
            Günlük önbelleklenmiş kullanıcı, hoax ve stok sayılarını görün; değerler backend’den
            çekilip 24 saatte bir yenilenir.
          </p>
        </div>
        <div className="row g-3">
          {statCards.map((item) => (
            <div key={item.label} className="col-12 col-md-4">
              <div className="stat-card">
                <div className="stat-card__head">
                  <div className="stat-icon">{item.icon}</div>
                  <div className="stat-value">{formatCount(item.value)}</div>
                </div>
                <p className="stat-label">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features container">
        <div className="section-header">
          <span className="pill pill-ghost">OtoEnvanter neler sunuyor?</span>
          <h2>Operasyonunuza uyumlu modüller</h2>
          <p className="section-subtitle">
            Stok yönetimi, hoax akışı ve takip altyapısıyla sektör içi işbirliği ve görünürlük
            sağlayın.
          </p>
        </div>
        <div className="row g-4">
          {features.map((item) => (
            <div key={item.title} className="col-12 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">{item.icon}</div>
                <div>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="steps container">
        <div className="section-header">
          <span className="pill pill-ghost">Başlarken</span>
          <h2>3 adımda kurulum</h2>
          <p className="section-subtitle">Teknik çaba yok, ekibiniz hazır.</p>
        </div>
        <div className="row g-3">
          {steps.map((step, index) => (
            <div key={step.title} className="col-12 col-lg-4">
              <div className="step-card">
                <div className="step-number">{index + 1}</div>
                <h6>{step.title}</h6>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta container">
        <div className="cta-banner">
          <div>
            <p className="eyebrow text-white">Hazır mısınız?</p>
            <h3>OtoEnvanter ile stok ve iletişim süreçlerinizi bugün sadeleştirin.</h3>
            <p className="text-white-50 mb-0">
              Kaydolun, ekibinizi davet edin, gerçek zamanlı görünürlüğü yakalayın.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/signup" className="btn btn-light btn-lg">
              {t("signup")}
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              {t("login")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const HomePage = () => {
  const { isLoggedIn } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
  }));
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { t } = useTranslation();

  if (!isLoggedIn) return <GuestHomepage />;

      const tabs = [
    {
      key: "feed",
      icon: "dynamic_feed",
      label: "Hoax Akışı",
      content: (
        <div className="feed-tab">
          <div className="mb-3">
            <HoaxSubmit onSuccess={() => setRefreshCounter((p) => p + 1)} />
          </div>
          <HoaxList refreshTrigger={refreshCounter} />
        </div>
      ),
    },
    {
      key: "users",
      icon: "people",
      label: "Kullanıcılar",
      content: (
        <div className="users-tab">
          <UserList />
        </div>
      ),
    },
  ];


  return (
    <div className="container main-home py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <Tabs tabs={tabs} storageKey="home_active_tab" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;




