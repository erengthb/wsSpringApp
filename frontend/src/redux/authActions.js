import * as ACTIONS from "./Constants";
import { login, signup } from "../api/apiCalls";

export const logoutSuccess = () => {
  return {
    type: ACTIONS.LOGOUT_SUCCESS,
  };
};

export const loginSuccess = (authState) => {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    payload: authState,
  };
};

export const updateSuccess = ({ displayName, image }) => {
  return {
    type: ACTIONS.UPDATE_SUCCCES,
    payload: {
      displayName,
      image,
    },
  };
};

export const loginHandler = (credentials) => {
  return async function (dispatch) {
    const normalized = {
      username: credentials.username ? credentials.username.trim() : "",
      password: credentials.password,
    };
    const response = await login(normalized);

    const authState = {
      ...response.data,
      password: normalized.password,
    };
    dispatch(loginSuccess(authState));
    return response;
  };
};

export const signupHandler = (user) => {
  return async function (dispatch) {
    return signup(user);
  };
};
