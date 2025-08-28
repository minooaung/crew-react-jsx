import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

export const useLogin = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await axios.post("/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      dispatch(authActions.settingUser(data.user));
    },
  });
};

export const useSignup = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await axios.post("/signup", userData);
      return data;
    },
    onSuccess: (data) => {
      dispatch(authActions.settingUser(data.user));
    },
  });
};

export const useLogout = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      await axios.post("/logout");
    },
    onSuccess: () => {
      dispatch(authActions.logout());
    },
  });
}; 