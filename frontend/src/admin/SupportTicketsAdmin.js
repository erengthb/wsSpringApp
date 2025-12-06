import React, { useEffect, useState } from "react";
import { FiMessageSquare, FiFilter, FiSend, FiRefreshCw } from "react-icons/fi";
import Spinner from "../components/Spinner";
import ButtonWithProgress from "../components/ButtonWithProgress";
import {
  addAdminTicketMessage,
  getAdminTicketDetail,
  getAdminTickets,
  updateAdminTicketStatus,
} from "./adminApi";
import "../css/Support.css";

const DEFAULT_PAGE = { content: [], last: true, number: 0, totalElements: 0 };

const statusOptions = [
  { value: "", label: "Tümü" },
  { value: "OPEN", label: "Açık" },
  { value: "IN_PROGRESS", label: "İşlemde" },
  { value: "RESOLVED", label: "Çözüldü" },
];

const typeOptions = [
  { value: "", label: "Tip" },
  { value: "SUPPORT", label: "Destek" },
  { value: "SUGGESTION", label: "Öneri" },
  { value: "COMPLAINT", label: "Şikayet" },
  { value: "BUG", label: "Hata" },
  { value: "FEATURE_REQUEST", label: "Geliştirme" },
];

const typeLabelMap = {
  SUPPORT: "Destek",
  SUGGESTION: "Öneri",
  COMPLAINT: "Şikayet",
  BUG: "Hata",
  FEATURE_REQUEST: "Geliştirme",
};

const badgeClass = (status) => {
  if (status === "RESOLVED") return "status-pill status-pill--success";
  if (status === "IN_PROGRESS") return "status-pill status-pill--warning";
  if (status === "") return "status-pill status-pill--muted";
  return "status-pill status-pill--info";
};

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

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("tr-TR");
};

const SupportTicketsAdmin = () => {
  const [filters, setFilters] = useState({ search: "", status: "", type: "" });
  const [pageData, setPageData] = useState(DEFAULT_PAGE);
  const [loadingList, setLoadingList] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadTickets = async (page = 0) => {
    setLoadingList(true);
    setError("");
    try {
      const res = await getAdminTickets({
        search: filters.search,
        status: filters.status || undefined,
        type: filters.type || undefined,
        page,
        size: 10,
      });
      setPageData(res.data);
    } catch (e) {
      setError("Talepler alınamadı");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadTickets(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.type]);

  useEffect(() => {
    const timer = setTimeout(() => loadTickets(0), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const openTicket = async (ticket) => {
    setSelected(ticket);
    setDetailLoading(true);
    try {
      const res = await getAdminTicketDetail(ticket.id);
      setDetail(res.data);
    } catch (e) {
      setError("Talep detayı getirilemedi");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    if (!detail) return;
    setSending(true);
    try {
      const res = await updateAdminTicketStatus(detail.id, status);
      setDetail((prev) => ({ ...prev, status: res.data.status }));
      setPageData((prev) => ({
        ...prev,
        content: prev.content.map((t) => (t.id === res.data.id ? { ...t, status: res.data.status } : t)),
      }));
    } catch (e) {
      setError("Durum güncellenemedi");
    } finally {
      setSending(false);
    }
  };

  const handleReply = async () => {
    if (!detail || !reply.trim() || detail.status === "RESOLVED") return;
    setSending(true);
    try {
      const res = await addAdminTicketMessage(detail.id, reply.trim());
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
    } catch (e) {
      setError("Mesaj gönderilemedi");
    } finally {
      setSending(false);
    }
  };

  const isResolved = detail?.status === "RESOLVED";

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Destek & Yardım</div>
          <h3>Destek Talepleri</h3>
          <p>Kullanıcıların açtığı talepleri incele, yanıtla ve durum ataması yap.</p>
        </div>
        <div className="panel-actions">
          <div className="filter-row">
            <div className="input-with-icon">
              <FiFilter />
              <input
                placeholder="Konu, kullanıcı veya ID ara"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              />
            </div>
            <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button className="btn btn-light btn-sm" onClick={() => loadTickets(pageData.number || 0)}>
              <FiRefreshCw style={{ marginRight: 4 }} />
              Yenile
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-2">{error}</div>}

      <div className="support-layout">
        <div className="support-list">
          {loadingList ? (
            <div className="py-4 text-center">
              <Spinner />
            </div>
          ) : (
            pageData.content.map((ticket) => (
              <div
                key={ticket.id}
                className={`support-card ${selected?.id === ticket.id ? "support-card--active" : ""}`}
                onClick={() => openTicket(ticket)}
              >
                <div className="support-card__row">
                  <div>
                    <div className="support-title">
                      <FiMessageSquare /> #{ticket.id} — {ticket.title}
                    </div>
                    <div className="muted">
                      {ticket.createdBy?.displayName} @{ticket.createdBy?.username}
                    </div>
                  </div>
                  <div className="support-card__meta">
                    <span className={badgeClass(ticket.status)}>{statusLabel(ticket.status)}</span>
                    <span className="pill pill-soft">
                      {ticket.type && typeLabelMap[ticket.type] ? typeLabelMap[ticket.type] : ticket.type}
                    </span>
                  </div>
                </div>
                <div className="support-card__footer">
                  <span className="muted">{formatDate(ticket.updatedAt || ticket.createdAt)}</span>
                  {ticket.lastMessage?.message && (
                    <span className="muted ellipsis">"{ticket.lastMessage.message.slice(0, 60)}"</span>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="admin-footer">
            <div />
            <div className="admin-pager">
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
        </div>

        <div className="support-detail">
          {!detail ? (
            <div className="muted">Talep seçin</div>
          ) : detailLoading ? (
            <div className="py-4 text-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="detail-head">
                <div>
                  <div className="eyebrow">Talep #{detail.id}</div>
                  <h4>{detail.title}</h4>
                  <div className="muted">
                    {detail.createdBy?.displayName} @{detail.createdBy?.username}
                  </div>
                </div>
                <div className="status-actions">
                  <select value={detail.status} onChange={(e) => handleStatusChange(e.target.value)} disabled={sending}>
                    {statusOptions
                      .filter((opt) => opt.value !== "")
                      .map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="message-timeline">
                {detail.messages?.map((msg) => (
                  <div key={msg.id} className={`message-bubble ${msg.fromAdmin ? "message-bubble--admin" : ""}`}>
                    <div className="message-meta">
                      <span className="muted">
                        {msg.fromAdmin ? "Admin" : msg.author?.displayName || "Kullanıcı"}
                      </span>
                      <span className="muted">{formatDate(msg.createdAt)}</span>
                    </div>
                    <div className="message-text">{msg.message}</div>
                  </div>
                ))}
              </div>

              <div className="reply-box">
                {isResolved && (
                  <div className="alert alert-info mb-2">Bu talep çözüldü. Yeni mesaj ekleyemezsiniz.</div>
                )}
                <textarea
                  rows={3}
                  placeholder="Admin yanıtı yazın"
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
      </div>
    </div>
  );
};

export default SupportTicketsAdmin;
