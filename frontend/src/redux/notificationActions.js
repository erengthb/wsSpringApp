
import { getNotifications } from '../api/apiCalls';

export const fetchNotifications = () => async (dispatch) => {
    const response = await getNotifications();
    dispatch({
      type: 'SET_NOTIFICATIONS',
      payload: response.data,
    });
  };