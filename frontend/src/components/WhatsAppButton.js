import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/905555555555?text=Merhaba%20destek%20istiyorum"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#25D366",
      color: "white",
      borderRadius: "50px",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      fontSize: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      zIndex: 1000,
      textDecoration: "none",
      overflow: "hidden",
      transition: "all 0.3s ease",
    }}
    className="whatsapp-button"
  >
    <FaWhatsapp size={24} style={{ marginRight: "8px" }} />
    <span
      style={{
        whiteSpace: "nowrap",
        opacity: 0,
        transition: "opacity 0.3s",
      }}
      className="whatsapp-text"
    >
    </span>
    <style>{`
      .whatsapp-button:hover {
        width: 180px;
      }
      .whatsapp-button:hover .whatsapp-text {
        opacity: 1;
      }
    `}</style>
  </a>
);

export default WhatsAppButton;
