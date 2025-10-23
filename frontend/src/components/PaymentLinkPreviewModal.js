import React, { useEffect, useRef, useState } from "react";

/**
 * Ödeme Linki Önizleme Modalı (güncel versiyon)
 * - Yalnızca ödeme kartını gösterir (arka plan/scroll gizli)
 * - Yukarıdan biraz daha fazla alan bırakır (logo dahil)
 * - Responsive ofset (ekran yüksekliğine göre ayarlanır)
 * - ESC ile veya arka plana tıklayarak kapanır
 */
const PaymentLinkPreviewModal = ({
  open,
  onClose,
  url,
  title = "Ödeme Linki Önizleme",
}) => {
  const backdropRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [offsetY, setOffsetY] = useState(56); // başlangıç
  const BASE_W = 430;
  const BASE_H = 932;

  // Responsive ofset hesaplama
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  useEffect(() => {
    const computeOffset = () => {
      // Ekran yüksekliğinin yaklaşık %6.5'i kadar yukarıdan kırp
      const v = clamp(window.innerHeight * 0.0085, 100, 78);
      setOffsetY(Math.round(v));
    };
    computeOffset();
    window.addEventListener("resize", computeOffset);
    return () => window.removeEventListener("resize", computeOffset);
  }, []);

  // ESC ile kapatma
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Arka plana tıklayınca kapat
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };




  return (
    <div
      ref={backdropRef}
      className="position-fixed w-100 h-100"
      style={{ inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white shadow rounded"
        style={{
          width: "min(720px, 96vw)",
          height: "min(760px, 92vh)",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between border-bottom px-3 py-2">
          <div className="d-flex align-items-center">
            <i className="material-icons mr-2">paid</i>
            <strong>{title}</strong>
          </div>
          <div className="btn-group">
       
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-primary"
              title="Yeni sekmede aç"
            >
              <i className="material-icons" style={{ fontSize: 18 }}>
                open_in_new
              </i>
              <span className="ml-1">Yeni Sekmede Aç</span>
            </a>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={onClose}
            >
              <i className="material-icons" style={{ fontSize: 18 }}>
                close
              </i>
              <span className="ml-1">Kapat</span>
            </button>
          </div>
        </div>

        {/* Body – sadece ödeme kartını gösteren alan */}
        <div
          className="flex-grow-1"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Responsive crop/scale */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(100%, 430px)", // telefon genişliği
            }}
          >
            <div
              style={{
                width: BASE_W,
                height: BASE_H,
                position: "relative",
                transformOrigin: "top center",
              }}
            >
              <iframe
                title="payment-preview"
                src={url}
                style={{
                  border: 0,
                  width: BASE_W,
                  height: BASE_H,
                  display: "block",
                  position: "absolute",
                  left: 0,
                  top: -offsetY, // responsive yukarı kaydırma
                }}
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentLinkPreviewModal;
