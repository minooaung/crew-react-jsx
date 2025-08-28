import axiosClient from "../axios-client";
import { handleApiError } from "../utils/apiErrorHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

export const useAxios = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleError = (error) => {
    const formattedError = handleApiError(error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Don't logout on login page
      if (window.location.pathname !== "/login") {
        dispatch(authActions.logout());
        navigate("/login");
      }
    }
    
    return Promise.reject(formattedError);
  };

  return {
    get: (url, config) => axiosClient.get(url, config).catch(handleError),
    post: (url, data, config) => axiosClient.post(url, data, config).catch(handleError),
    put: (url, data, config) => axiosClient.put(url, data, config).catch(handleError),
    delete: (url, config) => axiosClient.delete(url, config).catch(handleError),
  };
}; 