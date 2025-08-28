import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { useDispatch } from "react-redux";
import { notiActions } from "../../store/notification";
import { authActions } from "../../store/auth";

// Query keys
export const userKeys = {
  all: ["users"],
  lists: () => [...userKeys.all, "list"],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, "detail"],
  detail: (id) => [...userKeys.details(), id],
  selected: (ids) => [...userKeys.all, "selected", ids],
};

export const useUsers = (page = 1, search = "") => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: userKeys.list({ page, search }),
    queryFn: () => axios.get("/users", { params: { page, search } })
      .then(response => response.data),
    staleTime: 10000, // Consider data fresh for 10 seconds
    cacheTime: 300000, // Cache for 5 minutes
  });
};

// Hook to fetch specific users by their IDs
export const useSelectedUsers = (userIds = []) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: userKeys.selected(userIds),
    queryFn: () => {
      if (!userIds.length) return { data: [] };
      return axios.get("/users/selected", { 
        params: { ids: userIds.join(",") } 
      })
      .then(response => {
        // Return the response directly since it's already in the correct format
        return response.data;
      });
    },
    enabled: userIds.length > 0,
    staleTime: 10000, // Consider data fresh for 10 seconds
    cacheTime: 300000, // Cache for 5 minutes
  });
};

export const useUser = (id) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => axios.get(`/users/${id}`).then(response => response.data),
    enabled: !!id, // Only run if id is provided
    staleTime: 0, // Consider data immediately stale
    cacheTime: 0, // Don't cache the data
    refetchOnMount: true // Always refetch when component mounts
  });
};

export const useCreateUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: (userData) => axios.post("/users", userData)
      .then(response => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      dispatch(notiActions.settingNotiMessage("User created successfully"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    },
  });
};

export const useUpdateUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: ({ id, ...userData }) => axios.put(`/users/${id}`, userData)
      .then(response => response.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      
      // Update Redux store if the updated user is the logged-in user
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser.id === variables.id) {
        dispatch(authActions.settingUser({
          ...currentUser,
          ...data // Spread the updated user data
        }));
      }

      dispatch(notiActions.settingNotiMessage("User updated successfully"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    },
  });
};

export const useDeleteUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: (id) => axios.delete(`/users/${id}`)
      .then(response => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      dispatch(notiActions.settingNotiMessage("User was successfully deleted"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    }
  });
}; 