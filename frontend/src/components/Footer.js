import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto py-3">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div className="small text-center text-md-left">
          © {new Date().getFullYear()} Oto Envanter Yazılımı | BESOB iştirakidir
        </div>
        <div className="small text-center text-md-right mt-2 mt-md-0 text-white-50">
          Bu ürün
          {' '}
          <a
            href="https://liondreamin.com"
            className="text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            liondreamin.com
          </a>
          {' '}
          firmasına aittir.
        </div> 
      </div>
    </footer>
  );
};

export default Footer;


