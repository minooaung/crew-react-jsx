import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import UsersSelectorTable from "./UsersSelectorTable";
import {
  useOrganisation,
  useCreateOrganisation,
  useUpdateOrganisation,
} from "../hooks/queries/useOrganisations";
import ErrorAlert from "../utils/ErrorAlert";

export default function OrganisationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedUserIds, setSelectedUserIds] = useState([]); // Track selected users
  const [organisation, setOrganisation] = useState({
    id: null,
    name: "",
  });

  // Fetch organization data if editing
  const {
    data: orgData,
    isLoading: isLoadingOrg,
    error: orgError,
    refetch: refetchOrg,
  } = useOrganisation(id);

  // Create and update mutations
  const createOrganisationMutation = useCreateOrganisation();
  const updateOrganisationMutation = useUpdateOrganisation();

  // Update state when organization data changes
  useEffect(() => {
    if (orgData) {
      setOrganisation(orgData);
      // Only set the IDs of users that exist in the organization data
      const existingUserIds =
        orgData.users?.filter((u) => u.id).map((u) => u.id) || [];
      setSelectedUserIds(existingUserIds);
    }
  }, [orgData]);

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const payload = {
      ...organisation,
      user_ids: selectedUserIds,
    };

    try {
      if (organisation.id) {
        await updateOrganisationMutation.mutateAsync({
          id: organisation.id,
          ...payload,
        });
      } else {
        await createOrganisationMutation.mutateAsync(payload);
      }

      // Cancel any pending queries and remove cache before navigation
      queryClient.cancelQueries(["users"]);
      queryClient.cancelQueries(["organisation", id]);
      queryClient.removeQueries(["users"]);
      queryClient.removeQueries(["organisation", id]);

      // Invalidate and refetch organisations list after navigation
      await queryClient.invalidateQueries(["organisations"]);
      await queryClient.invalidateQueries(["dashboard"]);

      // Navigate after cleanup
      navigate("/organisations");
    } catch (err) {
      // Error handling is done in the mutation hooks
      console.error("Failed to save organisation:", err);
    }
  };

  const onCancel = () => navigate("/organisations");

  const validationErrors =
    orgError ||
    createOrganisationMutation.error ||
    updateOrganisationMutation.error;

  if (isLoadingOrg) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {organisation.id ? "Edit Organisation" : "New Organisation"}
        </h1>
      </div>

      {validationErrors && <ErrorAlert error={validationErrors} />}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Organisation Name
            </label>
            <input
              id="name"
              value={organisation.name}
              onChange={(ev) =>
                setOrganisation({ ...organisation, name: ev.target.value })
              }
              placeholder="Enter organisation name"
              required={!organisation.id}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="mt-1">
              <UsersSelectorTable
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={
                createOrganisationMutation.isPending ||
                updateOrganisationMutation.isPending
              }
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                createOrganisationMutation.isPending ||
                updateOrganisationMutation.isPending
              }
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {createOrganisationMutation.isPending ||
              updateOrganisationMutation.isPending
                ? "Saving..."
                : organisation.id
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
