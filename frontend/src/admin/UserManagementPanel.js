import React, { useEffect, useMemo, useState } from "react";
import { FiClock, FiMail, FiPhone, FiShield, FiMapPin, FiLock } from "react-icons/fi";
import Spinner from "../components/Spinner";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { getAdminUsers, updateAdminUser } from "./adminApi";
import "../admin/AdminDashboard.css";
import "../css/Support.css";

const DEFAULT_PAGE = { content: [], last: true, number: 0, totalElements: 0 };

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("tr-TR");
};

const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) return "0 dk";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} dk`;
  const hours = (mins / 60).toFixed(1);
  return `${hours} saat`;
};

const UserManagementPanel = () => {
  const [search, setSearch] = useState("");
  const [pageData, setPageData] = useState(DEFAULT_PAGE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const loadUsers = async (page = 0) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminUsers({ search, page, size: 10 });
      setPageData(res.data);
      if (res.data.content.length > 0) {
        setSelectedUser(res.data.content[0]);
        setForm({
          displayName: res.data.content[0].displayName || "",
          email: res.data.content[0].email || "",
          phoneNumber: res.data.content[0].phoneNumber || "",
          address: res.data.content[0].address || "",
          taxId: res.data.content[0].taxId || "",
          status: res.data.content[0].status,
          password: "",
        });
      } else {
        setSelectedUser(null);
        setForm({});
      }
    } catch (e) {
      setError("Kullanıcı listesi alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSelect = (user) => {
    setSelectedUser(user);
    setForm({
      displayName: user.displayName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      taxId: user.taxId || "",
      status: user.status,
      password: "",
    });
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    setError("");
    const payload = { ...form };
    if (!payload.password) {
      delete payload.password;
    }
    try {
      const res = await updateAdminUser(selectedUser.username, payload);
      setSelectedUser(res.data);
      setPageData((prev) => ({
        ...prev,
        content: prev.content.map((u) => (u.username === res.data.username ? res.data : u)),
      }));
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (e) {
      setError(e.response?.data?.message || "Güncelleme başarısız");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = () => {
    setForm((prev) => ({ ...prev, status: prev.status === 1 ? 0 : 1 }));
  };

  const pageInfo = useMemo(() => {
    const { number, totalElements, content } = pageData;
    const start = content.length === 0 ? 0 : number * 10 + 1;
    const end = start + content.length - 1;
    return { start, end, totalElements };
  }, [pageData]);

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow">Kontrol Merkezi</div>
          <h3>Kullanıcı İşlemleri</h3>
          <p>Kullanıcı bilgilerini görüntüle, güncelle ve yetkilendir.</p>
        </div>
        <div className="panel-actions">
          <input
            className="admin-search"
            placeholder="Kullanıcı adı, ad, e-posta ara"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-light btn-sm" onClick={() => loadUsers(pageData.number || 0)}>
            Yenile
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-2">{error}</div>}

      <div className="user-grid">
        <div className="user-list-card">
          <div className="list-head">
            <span>Son kayıtlar</span>
            <span className="muted">{pageInfo.totalElements} kişi</span>
          </div>
          {loading ? (
            <div className="py-4 text-center">
              <Spinner />
            </div>
          ) : (
            <div className="user-list">
              {pageData.content.map((user) => {
                const isActive = selectedUser?.username === user.username;
                return (
                  <div
                    key={user.id}
                    className={`user-card ${isActive ? "user-card--active" : ""}`}
                    onClick={() => handleSelect(user)}
                  >
                    <div className="user-card__meta">
                      <div className="user-card__name">{user.displayName}</div>
                      <div className="user-card__username">@{user.username}</div>
                    </div>
                    <div className="user-card__status">
                      <span className={`status-pill ${user.status === 1 ? "status-pill--success" : "status-pill--muted"}`}>
                        {user.status === 1 ? "Aktif" : "Pasif"}
                      </span>
                      <div className="muted">{formatDate(user.lastLoginAt)}</div>
                    </div>
                  </div>
                );
              })}
              {pageData.content.length === 0 && <div className="muted">Kayıt bulunamadı</div>}
            </div>
          )}
          <div className="admin-footer">
            <div>
              {pageInfo.totalElements > 0 && (
                <span>
                  {pageInfo.start}-{pageInfo.end} / {pageInfo.totalElements}
                </span>
              )}
            </div>
            <div className="admin-pager">
              <button
                className="btn btn-light btn-sm"
                disabled={pageData.number <= 0 || loading}
                onClick={() => loadUsers((pageData.number || 0) - 1)}
              >
                Önceki
              </button>
              <button
                className="btn btn-light btn-sm"
                disabled={pageData.last || loading}
                onClick={() => loadUsers((pageData.number || 0) + 1)}
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>

        <div className="user-detail-card">
          {!selectedUser ? (
            <div className="muted">Bir kullanıcı seçin</div>
          ) : (
            <>
              <div className="detail-head">
                <div>
                  <div className="eyebrow">Kullanıcı</div>
                  <h4>{selectedUser.displayName}</h4>
                  <div className="muted">@{selectedUser.username}</div>
                </div>
                <div className="status-toggle">
                  <span className={`status-pill ${form.status === 1 ? "status-pill--success" : "status-pill--muted"}`}>
                    {form.status === 1 ? "Aktif" : "Pasif"}
                  </span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={form.status === 1}
                      onChange={toggleStatus}
                      disabled={selectedUser.username === "admin"}
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>

              <div className="detail-grid">
                <label className="form-field">
                  <span>Ad Soyad</span>
                  <input
                    value={form.displayName || ""}
                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                  />
                </label>
                <label className="form-field">
                  <span>E-posta</span>
                  <div className="input-with-icon">
                    <FiMail />
                    <input
                      value={form.email || ""}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </label>
                <label className="form-field">
                  <span>Telefon</span>
                  <div className="input-with-icon">
                    <FiPhone />
                    <input
                      value={form.phoneNumber || ""}
                      onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                    />
                  </div>
                </label>
                <label className="form-field">
                  <span>Vergi No / Firma ID</span>
                  <input
                    value={form.taxId || ""}
                    onChange={(e) => setForm((f) => ({ ...f, taxId: e.target.value }))}
                  />
                </label>
                <label className="form-field">
                  <span>Adres</span>
                  <div className="input-with-icon">
                    <FiMapPin />
                    <input
                      value={form.address || ""}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    />
                  </div>
                </label>
                <label className="form-field">
                  <span>Şifre</span>
                  <div className="input-with-icon">
                    <FiLock />
                    <input
                      type="password"
                      placeholder="Değiştirmek için yeni şifre girin"
                      value={form.password || ""}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    />
                  </div>
                </label>
              </div>

              <div className="metrics-row">
                <div className="metric">
                  <FiClock />
                  <div>
                    <div className="muted">Son giriş</div>
                    <strong>{formatDate(selectedUser.lastLoginAt)}</strong>
                  </div>
                </div>
                <div className="metric">
                  <FiShield />
                  <div>
                    <div className="muted">Son aktivite</div>
                    <strong>{formatDate(selectedUser.lastSeenAt)}</strong>
                  </div>
                </div>
                <div className="metric">
                  <FiClock />
                  <div>
                    <div className="muted">Toplam süre</div>
                    <strong>{formatDuration(selectedUser.activeDurationSeconds)}</strong>
                  </div>
                </div>
              </div>

              <div className="detail-actions">
                <ButtonWithProgress
                  className="btn btn-primary"
                  onClick={handleSave}
                  pendingApiCall={saving}
                  disabled={saving}
                  text="Kaydet"
                />
                <button className="btn btn-outline-light" onClick={() => handleSelect(selectedUser)} disabled={saving}>
                  Sıfırla
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPanel;
