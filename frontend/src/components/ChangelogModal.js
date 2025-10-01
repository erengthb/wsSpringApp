// src/components/ChangelogModal.js
import React, { useEffect } from "react";
import PropTypes from "prop-types";

const DEFAULT_UPDATES = [
  {
    id: 1,
    date: "2025-09-29",
    title: "Gelecek Güncellemeler",
    notes: [
      "QR Kodu ile Stok listesine ürün ekleme ve çıkarma ",
      "Destek talepleri için yeni bir sayfa geliştirmesi: Destek taleplerini artık bu yeni geliştirilecek olan sayfada kolayca bize bildirebilirsiniz.",
      "Detaylıca hoax araması yapabilmek için hoax sayfası  içinde hoax  arama alanının  geliştirilmesi",
      "Sayfa Tasarımı iyileştirmeleri",
      "Uygulama performans  iyileştirmeleri",
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
  const list =
    Array.isArray(updates) && updates.length > 0 ? updates : DEFAULT_UPDATES;

  // Body scroll kilidi – short-circuit kullanımını if ile değiştiriyoruz
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC kapatma – yine if kullanıyoruz
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
        style={{ zIndex: 1050 }}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Güncelleme Notları</h5>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={handleCloseClick}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              {list.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {list.map((item) => (
                    <li key={item.id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between">
                        <strong>{item.title}</strong>
                        <small className="text-muted">{item.date}</small>
                      </div>
                      {Array.isArray(item.notes) && item.notes.length > 0 ? (
                        <ul className="mt-2 mb-0">
                          {item.notes.map((n, idx) => (
                            <li key={idx}>{n}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted mb-0">Detay yok.</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted">
                  Şimdilik gösterilecek güncelleme yok.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseClick}
              >
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
