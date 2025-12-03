import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAdminUsers, updateAdminUser } from "./adminApi";
import "./AdminDashboard.css";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Spinner from "../components/Spinner";

const DEFAULT_PAGE = { content: [], last: true, number: 0, totalElements: 0 };

const AdminDashboard = () => {
  const history = useHistory();
  const { isLoggedIn, username } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
  }));

  const [search, setSearch] = useState("");
  const [pageData, setPageData] = useState(DEFAULT_PAGE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");

  const isAdmin = isLoggedIn && username === "admin";

  useEffect(() => {
    if (!isAdmin) {
      history.push("/");
    }
  }, [isAdmin, history]);

  const loadUsers = async (page = 0) => {
    if (!isAdmin) return;
    setLoading(true);
    setError("");
    try {
      const res = await getAdminUsers({ search, page, size: 10 });
      setPageData(res.data);
    } catch (e) {
      setError("Kullanıcı listesi alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isAdmin]);

  const startEdit = (user) => {
    setEditingUser(user.username);
    setEditForm({
      displayName: user.displayName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      status: user.status,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleSave = async (usernameToSave) => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...editForm };
      // Status toggle uses this handler too
      const res = await updateAdminUser(usernameToSave, payload);
      setPageData((prev) => ({
        ...prev,
        content: prev.content.map((u) => (u.username === usernameToSave ? res.data : u)),
      }));
      cancelEdit();
    } catch (e) {
      setError(e.response?.data?.message || "Kaydetme işlemi başarısız");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user) => {
    const next = user.status === 1 ? 0 : 1;
    setEditForm({ status: next });
    await handleSave(user.username);
  };

  const pageInfo = useMemo(() => {
    const { number, totalElements, content } = pageData;
    const start = content.length === 0 ? 0 : number * 10 + 1;
    const end = start + content.length - 1;
    return { start, end, totalElements };
  }, [pageData]);

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <div className="eyebrow">Admin Panel</div>
          <h2>Kullanıcı Yönetimi</h2>
          <p>Sistemdeki kullanıcıları görüntüle, ara, düzenle ve aktif/pasif yap.</p>
        </div>
      </header>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Kullanıcı adı, ad veya e-posta ara"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="admin-refresh" onClick={() => loadUsers(pageData.number || 0)}>
          Yenile
        </button>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div className="admin-table">
        <div className="admin-table__head">
          <span>Kullanıcı</span>
          <span>E-posta</span>
          <span>Telefon</span>
          <span>Durum</span>
          <span>İşlem</span>
        </div>

        {loading ? (
          <div className="admin-table__loading">
            <Spinner />
          </div>
        ) : (
          pageData.content.map((user) => {
            const isEditing = editingUser === user.username;
            return (
              <div key={user.id} className="admin-table__row">
                <div className="admin-cell">
                  <div className="admin-user">
                    <div className="admin-user__name">{user.displayName}</div>
                    <div className="admin-user__meta">@{user.username}</div>
                  </div>
                </div>
                <div className="admin-cell">
                  {isEditing ? (
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  ) : (
                    user.email || "—"
                  )}
                </div>
                <div className="admin-cell">
                  {isEditing ? (
                    <input
                      value={editForm.phoneNumber}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, phoneNumber: e.target.value }))
                      }
                    />
                  ) : (
                    user.phoneNumber || "—"
                  )}
                </div>
                <div className="admin-cell">
                  <span className={`badge ${user.status === 1 ? "badge-success" : "badge-muted"}`}>
                    {user.status === 1 ? "Aktif" : "Pasif"}
                  </span>
                  {isEditing && (
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={editForm.status === 1}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, status: e.target.checked ? 1 : 0 }))
                        }
                      />
                      <span className="slider" />
                    </label>
                  )}
                </div>
                <div className="admin-cell admin-actions">
                  {isEditing ? (
                    <>
                      <ButtonWithProgress
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSave(user.username)}
                        pendingApiCall={saving}
                        disabled={saving}
                        text="Kaydet"
                      />
                      <button className="btn btn-light btn-sm" onClick={cancelEdit} disabled={saving}>
                        Vazgeç
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-outline-light btn-sm" onClick={() => startEdit(user)}>
                        Düzenle
                      </button>
                      <button
                        className="btn btn-outline-light btn-sm"
                        onClick={() => toggleStatus(user)}
                        disabled={saving}
                      >
                        {user.status === 1 ? "Pasif Yap" : "Aktif Yap"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

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
  );
};

export default AdminDashboard;
