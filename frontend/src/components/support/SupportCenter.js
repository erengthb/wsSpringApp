import React, { useEffect, useState } from "react";
import { FiPlus, FiSend, FiMessageCircle, FiFilter } from "react-icons/fi";
import ButtonWithProgress from "../ButtonWithProgress";
import Spinner from "../Spinner";
import { createSupportTicket, getTicketDetail, listMyTickets, postTicketMessage } from "../../api/supportApi";
import "../../css/Support.css";

const DEFAULT_PAGE = { content: [], last: true, number: 0, totalElements: 0 };

const statusLabel = (status) => {
  switch (status) {
    case "IN_PROGRESS":
      return "İşlemde";
    case "RESOLVED":
      return "Çözüldü";
    default:
      return "Açık";
  }
};

const typeLabel = {
  SUPPORT: "Destek",
  SUGGESTION: "Öneri",
  COMPLAINT: "Şikayet",
  BUG: "Hata",
  FEATURE_REQUEST: "Geliştirme",
};

const badgeClass = (status) => {
  if (status === "RESOLVED") return "status-pill status-pill--success";
  if (status === "IN_PROGRESS") return "status-pill status-pill--warning";
  return "status-pill status-pill--info";
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("tr-TR");
};

const SupportCenter = () => {
  const [form, setForm] = useState({ title: "", type: "SUPPORT", message: "" });
  const [pageData, setPageData] = useState(DEFAULT_PAGE);
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const loadTickets = async (page = 0) => {
    setLoadingList(true);
    setError("");
    try {
      const res = await listMyTickets({ status: statusFilter || undefined, page, size: 10 });
      setPageData(res.data);
    } catch {
      setError("Talepler alınamadı");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadTickets(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const openTicket = async (ticket) => {
    setSelected(ticket);
    setDetailLoading(true);
    try {
      const res = await getTicketDetail(ticket.id);
      setDetail(res.data);
    } catch {
      setError("Talep detayı getirilemedi");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await createSupportTicket({
        title: form.title.trim(),
        type: form.type,
        message: form.message.trim(),
      });
      setForm({ title: "", type: "SUPPORT", message: "" });
      setPageData((prev) => ({
        ...prev,
        content: [res.data, ...prev.content],
        totalElements: (prev.totalElements || 0) + 1,
      }));
      setSelected(res.data);
      setDetail(res.data);
      setToast(
        "Destek talebiniz alınmıştır. Talebiniz incelenerek en geç 48 saat içerisinde tarafınıza talebiniz ile ilgili dönüş yapılacaktır.",
      );
    } catch (e) {
      setError(e.response?.data?.message || "Talep oluşturulamadı");
    } finally {
      setCreating(false);
    }
  };

  const handleReply = async () => {
    if (!detail || !reply.trim() || detail.status === "RESOLVED") return;
    setSending(true);
    setError("");
    try {
      const res = await postTicketMessage(detail.id, { message: reply.trim() });
      setDetail((prev) => ({
        ...prev,
        messages: [...(prev?.messages || []), res.data],
        lastMessage: res.data,
      }));
      setPageData((prev) => ({
        ...prev,
        content: prev.content.map((t) =>
          t.id === detail.id ? { ...t, lastMessage: res.data, updatedAt: new Date().toISOString() } : t,
        ),
      }));
      setReply("");
    } catch {
      setError("Mesaj gönderilemedi");
    } finally {
      setSending(false);
    }
  };

  const isResolved = detail?.status === "RESOLVED";

  return (
    <div className="support-page">
      <div className="container">
        {toast && (
          <div className="toast-inline">
            <div className="toast-body">
              <span>{toast}</span>
              <button className="btn btn-link btn-sm" onClick={() => setToast("")}>
                Kapat
              </button>
            </div>
          </div>
        )}
        <div className="support-header">
          <p className="muted mb-1">Destek Talebi</p>
          <h3>Yeni talep oluşturun, mevcut talepleri takip edin</h3>
          <p className="muted">
            Başvurunuz oluşturulduğunda hesabınız pasif kalır; admin yanıtı veya durum değişikliği bildirim olarak gelir.
          </p>
        </div>

        {error && <div className="alert alert-danger mb-2">{error}</div>}

        <div className="support-card support-form">
          <div className="support-card__title">
            <div className="pill">
              <FiPlus /> Yeni Destek Talebi
            </div>
            <div className="muted">Sorun, istek veya önerinizi net cümlelerle yazın.</div>
          </div>
          <div className="support-grid">
            <div className="form-grid">
              <label className="form-field">
                <span>Konu</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Talebinizin konusunu girin"
                />
              </label>
              <label className="form-field">
                <span>Tür</span>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                  <option value="SUPPORT">Destek</option>
                  <option value="SUGGESTION">Öneri</option>
                  <option value="COMPLAINT">Şikayet</option>
                  <option value="BUG">Hata</option>
                  <option value="FEATURE_REQUEST">Geliştirme</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              <span>Mesaj</span>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Kısa ve net açıklama"
              />
            </label>
            <div className="text-end">
              <ButtonWithProgress
                className="btn btn-primary"
                onClick={handleCreate}
                pendingApiCall={creating}
                disabled={creating || !form.title.trim() || !form.message.trim()}
                text={
                  <span className="d-inline-flex align-items-center gap-1">
                    <FiSend /> Talep Oluştur
                  </span>
                }
              />
            </div>
          </div>
        </div>

        <div className="support-card">
          <div className="support-card__title">
            <div className="d-flex align-items-center gap-2">
              <FiMessageCircle />
              <strong>Destek Taleplerim</strong>
            </div>
            <div className="filter-row">
              <FiFilter className="muted" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Tümü</option>
                <option value="OPEN">Açık</option>
                <option value="IN_PROGRESS">İşlemde</option>
                <option value="RESOLVED">Çözüldü</option>
              </select>
            </div>
          </div>

          {loadingList ? (
            <div className="py-4 text-center">
              <Spinner />
            </div>
          ) : (
            <div className="support-list">
              {pageData.content.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`support-item ${selected?.id === ticket.id ? "active" : ""}`}
                  onClick={() => openTicket(ticket)}
                >
                  <div className="support-item__row">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="support-id">#{ticket.id}</span>
                        <strong>{ticket.title}</strong>
                      </div>
                      <div className="muted">{formatDate(ticket.updatedAt || ticket.createdAt)}</div>
                    </div>
                    <div className="support-item__meta">
                      <span className={badgeClass(ticket.status)}>{statusLabel(ticket.status)}</span>
                      <span className="pill">{typeLabel[ticket.type] || ticket.type}</span>
                    </div>
                  </div>
                  {ticket.lastMessage?.message && (
                    <div className="muted">“{ticket.lastMessage.message.slice(0, 80)}”</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn btn-light btn-sm"
              disabled={pageData.number <= 0 || loadingList}
              onClick={() => loadTickets((pageData.number || 0) - 1)}
            >
              Önceki
            </button>
            <button
              className="btn btn-light btn-sm"
              disabled={pageData.last || loadingList}
              onClick={() => loadTickets((pageData.number || 0) + 1)}
            >
              Sonraki
            </button>
          </div>
        </div>

        {detail && (
          <div className="support-card support-detail">
            {detailLoading ? (
              <div className="py-4 text-center">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="support-card__title">
                  <div>
                    <div className="muted">Talep #{detail.id}</div>
                    <h4>{detail.title}</h4>
                    <div className="muted">Durum: {statusLabel(detail.status)}</div>
                  </div>
                  <span className={badgeClass(detail.status)}>{statusLabel(detail.status)}</span>
                </div>

                <div className="message-timeline">
                  {detail.messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-bubble ${msg.fromAdmin ? "message-bubble--admin" : ""}`}
                      style={msg.fromAdmin ? { borderColor: "#1d4ed8", background: "#e0ecff" } : {}}
                    >
                      <div className="message-meta">
                        <span className="muted">{msg.fromAdmin ? "Destek (Admin)" : "Siz"}</span>
                        <span className="muted">{formatDate(msg.createdAt)}</span>
                      </div>
                      <div className="message-text" style={msg.fromAdmin ? { fontWeight: 600, color: "#0f172a" } : {}}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="reply-box">
                  {isResolved && (
                    <div className="alert alert-info mb-2">
                      Bu talep çözüldü. Yeni mesaj ekleyemezsiniz.
                    </div>
                  )}
                  <textarea
                    rows={3}
                    placeholder="Yanıt yazın"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    disabled={isResolved}
                  />
                  <ButtonWithProgress
                    className="btn btn-primary"
                    onClick={handleReply}
                    pendingApiCall={sending}
                    disabled={!reply.trim() || sending || isResolved}
                    text={
                      <span className="d-inline-flex align-items-center gap-1">
                        <FiSend /> Gönder
                      </span>
                    }
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportCenter;
