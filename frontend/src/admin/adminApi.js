import axios from "axios";

export const getAdminUsers = ({ search = "", page = 0, size = 10 } = {}) => {
  return axios.get("/api/admin/1.0/users", {
    params: { search, page, size },
  });
};

export const updateAdminUser = (username, payload) => {
  return axios.put(`/api/admin/1.0/users/${encodeURIComponent(username)}`, payload);
};

export const getAdminTickets = ({ search = "", status, type, page = 0, size = 10 } = {}) => {
  return axios.get("/api/admin/1.0/support/tickets", {
    params: { search, status, type, page, size },
  });
};

export const getAdminTicketDetail = (id) => {
  return axios.get(`/api/admin/1.0/support/tickets/${id}`);
};

export const updateAdminTicketStatus = (id, status) => {
  return axios.put(`/api/admin/1.0/support/tickets/${id}/status`, { status });
};

export const addAdminTicketMessage = (id, message) => {
  return axios.post(`/api/admin/1.0/support/tickets/${id}/messages`, { message });
};
