// src/components/ChangelogModal.js
import React, { useEffect } from "react";
import PropTypes from "prop-types";

const DEFAULT_UPDATES = [
  {
    id: "latest",
    date: "03/12/2025",
    title: "Son Güncellemeler",
    notes: [
      "Bildirim paneli üst barda açık renk kartlarla açılıyor; okundu sayacı resetleniyor.",
      "Profildeki son hoaxlar başlık, sayaç ve kart tasarımıyla öne çıktı.",
      "Giriş ve ana sayfa akışında daha temiz, modern arayüz dokunuşları.",
    ],
  },
  {
    id: "next",
    date: "25/12/2025",
    title: "Gelecek Güncellemeler",
    notes: [
      "QR Kodu ile stok listesine ürün ekleme ve çıkarma",
      "Destek talepleri için yeni bir sayfa: talepleri kolayca iletebileceksiniz.",
      "Hoax sayfası içinde detaylı arama alanı",
      "Sayfa tasarım iyileştirmeleri",
      "Uygulama performans iyileştirmeleri",
    ],
  },
];

function Backdrop({ onClick }) {
  return (
    <div
      className="modal-backdrop show"
      onClick={onClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1040,
      }}
      aria-hidden="true"
    />
  );
}

Backdrop.propTypes = {
  onClick: PropTypes.func,
};

const ChangelogModal = ({ open, onClose, updates }) => {
  const list = Array.isArray(updates) && updates.length > 0 ? updates : DEFAULT_UPDATES;

  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        if (typeof onClose === "function") {
          onClose();
        }
      }
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleCloseClick = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <>
      <div
        className="modal d-block"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1050, overflowY: "auto", padding: "1rem" }}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
          role="document"
          style={{ margin: "0 auto" }}
        >
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 14 }}>
            <div className="modal-header border-0 pb-0">
              <div>
                <div className="d-inline-block px-2 py-1 bg-light rounded-pill text-uppercase small text-muted">
                  Güncellemeler
                </div>
                <h5 className="modal-title mt-2 mb-1" style={{ fontWeight: 800 }}>
                  Son değişiklikler ve yol haritası
                </h5>
                <p className="mb-0 text-muted small">
                 Uygulama hakkındaki son güncelleme bilgileri ve gelecek olan günceleme hakkında içerik bilgisi burada gösterilir.
                </p>
              </div>
              <button type="button" className="close" aria-label="Close" onClick={handleCloseClick}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body pt-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {list.length > 0 ? (
                <div className="d-grid gap-3">
                  {list.map((item) => (
                    <div key={item.id} className="card shadow-sm border-0" style={{ borderRadius: 12 }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge badge-primary" style={{ fontSize: "0.8rem" }}>
                            {item.title}
                          </span>
                          <small className="text-muted">{item.date}</small>
                        </div>
                        {Array.isArray(item.notes) && item.notes.length > 0 ? (
                          <ul className="mb-0 pl-3">
                            {item.notes.map((n, idx) => (
                              <li key={idx} style={{ marginBottom: 6 }}>
                                {n}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted mb-0">Detay yok.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted">Şimdilik gösterilecek güncelleme yok.</div>
              )}
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-secondary" onClick={handleCloseClick}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>

      <Backdrop onClick={handleCloseClick} />
    </>
  );
};

ChangelogModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  updates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      date: PropTypes.string,
      title: PropTypes.string,
      notes: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

export default ChangelogModal;
