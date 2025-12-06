import axios from "axios";

export const createSupportTicket = (payload) => {
  return axios.post("/api/1.0/support/tickets", payload);
};

export const listMyTickets = ({ status, page = 0, size = 10 } = {}) => {
  return axios.get("/api/1.0/support/tickets", {
    params: { status, page, size },
  });
};

export const getTicketDetail = (id) => {
  return axios.get(`/api/1.0/support/tickets/${id}`);
};

export const postTicketMessage = (id, payload) => {
  return axios.post(`/api/1.0/support/tickets/${id}/messages`, payload);
};
