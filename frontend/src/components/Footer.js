import React from "react";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer mt-auto py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="footer-brand mb-3 mb-md-0">
          <strong>OtoEnvanter</strong>
          <div className="small text-muted">
            © {new Date().getFullYear()} BESOB · Bursa Yedek Parçacılar Odası iştirakidir
          </div>
        </div>

        <nav className="footer-nav d-flex gap-3 align-items-center">
          <a
            className="pill-link"
            href="mailto:inf@liondreamin.com?subject=Destek Talebi&body=Merhaba,"
          >
            Destek
          </a>
        </nav>

        <div className="footer-credits small text-muted mt-3 mt-md-0">
          Geliştiren ·{" "}
          <a href="https://www.liondreamin.com" target="_blank" rel="noreferrer">
            liondreamin.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
