import axios from 'axios';

// Backend base URL'yi ortam değişkeninden alıyoruz
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// --- LANGUAGE HEADER AYARI ---
export const setLanguageHeader = (language) => {
  axios.defaults.headers['Accept-Language'] = language;
};



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

// 🔴 DEĞİŞEN: multipart/form-data
export const updateUser = (username, body) => {
  const fd = new FormData();
  fd.append('displayName', body.displayName);
  if (body.phoneNumber) fd.append('phoneNumber', body.phoneNumber);
  if (body.email) fd.append('email', body.email);
  if (body.address) fd.append('address', body.address);
  if (body.imageFile) fd.append('image', body.imageFile);

  return axios.put(`/api/1.0/users/${username}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
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

export const getOldHoaxesOfUser = (username, id) => {
  return axios.get(`/api/1.0/users/${username}/hoaxes/${id}`);
};


export const requestCaptcha = () => {
  return axios.post('/api/1.0/captcha/request');
};

export const verifyCaptcha = (captchaId, captchaInput) => {
  return axios.post('/api/1.0/captcha/verify', {
    captchaId,
    captchaInput
  });
};

export const followUser = (username) => {
  return axios.post(`/api/1.0/users/${username}/follow`);
};

export const unfollowUser = (username) => {
  return axios.post(`/api/1.0/users/${username}/unfollow`);
};

export const getUserForFollowAndUnfollow = (username) => {
  return axios.get(`/api/1.0/users/${username}`);
};

export const getUserFollowers = (username) => {
  return axios.get(`/api/1.0/users/${username}/followers`);
};

export const getUserFollowing = (username) => {
  return axios.get(`/api/1.0/users/${username}/following`);
};

export const getNotifications = () => {
  return axios.get('/api/1.0/notifications');
};

// ✅ STOCK işlemleri
export const addStock = (stockData) => {
  return axios.post('/api/1.0/stocks', stockData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


export const getUserStocks = (username, page = 0, size = 10) => {
  return axios.get(`/api/1.0/users/${username}/stocks`, {
    params: { page, size },
  });
};


export const updateStockQuantity = (stockId, newQuantity) => {
  return axios.patch(`/api/1.0/stocks/${stockId}`, { quantity: newQuantity });
};

export const deleteStock = (stockId) => {
  return axios.delete(`/api/1.0/stocks/${stockId}`);
};

export const searchUserStocks = (username, query, page = 0, size = 10) => {
  return axios.get(`/api/1.0/users/${username}/stocks/search`, {
    params: {
      q: query,
      page,
      size,
    },
  });
};




