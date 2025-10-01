import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer mt-auto py-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="footer-brand mb-2 mb-md-0">
          <strong>OTO ENVANTER</strong>
          <div className="small">
            © {new Date().getFullYear()} BESOB. Bursa Yedek Parçacılar Odası
            iştirakidir.
          </div>
        </div>

        <nav className="footer-nav d-flex gap-3">
          <a href="mailto:inf@liondreamin.com?subject=Destek Talebi&body=Merhaba,">
            Destek
          </a>
        </nav>

        <div className="footer-credits small text-muted mt-2 mt-md-0">
          Geliştiren - www.liondreamin.com
        </div>
      </div>
    </footer>
  );
};

export default Footer;
