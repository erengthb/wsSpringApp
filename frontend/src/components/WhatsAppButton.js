import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "../css/WhatsAppButton.css";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/905056316454"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FaWhatsapp size={24} className="whatsapp-icon" />
      <span className="whatsapp-text">WhatsApp Destek</span>
    </a>
  );
};

export default WhatsAppButton;
