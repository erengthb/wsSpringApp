import axios from "axios";

export const getAdminUsers = ({ search = "", page = 0, size = 10 } = {}) => {
  return axios.get("/api/admin/1.0/users", {
    params: { search, page, size },
  });
};

export const updateAdminUser = (username, payload) => {
  return axios.put(`/api/admin/1.0/users/${encodeURIComponent(username)}`, payload);
};
