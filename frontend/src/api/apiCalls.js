import axios from 'axios';

// Backend base URL'yi ortam değişkeninden alıyoruz
axios.defaults.baseURL = process.env.REACT_APP_API_URL;


export const signup = body => {
  return axios.post('/api/1.0/users', body);
};

export const login = creds => {
  return axios.post('/api/1.0/auth', {}, { auth: creds });
};

export const changeLanguage = language => {
  axios.defaults.headers['accept-language'] = language;
};

export const getUsers = (page = 0, size = 3) => {
  return axios.get(`/api/1.0/users?page=${page}&size=${size}`);
};

export const setAuthorizationHeader = ({ username, password, isLoggedIn }) => {
  if (isLoggedIn) {
    const authorizationHeaderValue = `Basic ${btoa(username + ':' + password)}`;
    axios.defaults.headers['Authorization'] = authorizationHeaderValue;
  } else {
    delete axios.defaults.headers['Authorization'];
  }
};

export const getUser = username => {
  return axios.get(`/api/1.0/users/${username}`);
};

export const updateUser = (username, body) => {
  return axios.put(`/api/1.0/users/${username}`, body);
};

export const postHoax = hoax => {
  return axios.post('/api/1.0/hoaxes', hoax);
};

export const getHoaxes = (username, page = 0) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes?page=` : '/api/1.0/hoaxes?page=';
  return axios.get(path + page);
};

export const getOldHoaxes = id => {
  return axios.get('/api/1.0/hoaxes/' + id );
}