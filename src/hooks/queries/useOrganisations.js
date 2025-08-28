import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../useAxios";

export const useOrganisations = (page = 1, search = "") => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["organisations", page, search],
    queryFn: () =>
      axios
        .get("/organisations", { params: { page, search } })
        .then((response) => response.data),
    // Add staleTime to prevent unnecessary refetches
    staleTime: 5000, // Consider data fresh for 5 seconds
  });
};

export const useOrganisation = (id) => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["organisation", id],
    queryFn: () =>
      axios.get(`/organisations/${id}`).then((response) => response.data),
    enabled: !!id,
  });
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: (orgData) =>
      axios.post("/organisations", orgData).then((response) => response.data),
    onSuccess: (data) => {
      // Update the organizations list without triggering an immediate refetch
      queryClient.invalidateQueries({
        queryKey: ["organisations"],
        refetchType: "none",
      });

      // Add the new organization to the cache
      queryClient.setQueryData(["organisation", data.id], data);

      // Mark dashboard as stale but don't refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
        refetchType: "none",
      });
    },
  });
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: ({ id, ...orgData }) =>
      axios
        .put(`/organisations/${id}`, orgData)
        .then((response) => response.data),
    onSuccess: (data, variables) => {
      // Update the organization in the cache immediately
      queryClient.setQueryData(["organisation", variables.id], data);

      // Mark the organizations list as stale but don't refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["organisations"],
        refetchType: "none",
      });

      // Mark dashboard as stale but don't refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
        refetchType: "none",
      });
    },
  });
};

export const useDeleteOrganisation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: (id) =>
      axios.delete(`/organisations/${id}`).then((response) => response.data),
    onSuccess: () => {
      // Invalidate organisations list and dashboard stats
      queryClient.invalidateQueries(["organisations"]);
      queryClient.invalidateQueries(["dashboard"]);
    },
  });
};
