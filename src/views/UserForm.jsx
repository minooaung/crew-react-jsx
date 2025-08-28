import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUser,
  useCreateUser,
  useUpdateUser,
} from "../hooks/queries/useUsers";
import { useSelector } from "react-redux";
import ErrorAlert from "../utils/ErrorAlert";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  });

  // Fetch user data if editing
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useUser(id);

  // Create and update mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Update state when user data changes
  useEffect(() => {
    if (userData) {
      setUser({
        ...userData,
        password: "", // Don't populate password fields
        password_confirmation: "",
      });
    }
  }, [userData]);

  // Effect to refetch data when id changes
  useEffect(() => {
    if (id) {
      refetchUser();
    }
  }, [id, refetchUser]);

  const onSubmit = async (ev) => {
    ev.preventDefault();

    try {
      if (user.id) {
        // For update, only include password if it's provided
        const updateData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.password
            ? {
                password: user.password,
                password_confirmation: user.password_confirmation,
              }
            : {}),
        };

        const response = await updateUserMutation.mutateAsync(updateData);

        // Update Redux store if the updated user is the logged-in user
        if (reduxUser && reduxUser.id === user.id) {
          // The mutation hook will handle the Redux update
          console.log("Updated logged-in user:", response);
        }

        // Force a refetch after update
        await refetchUser();
      } else {
        await createUserMutation.mutateAsync(user);
      }
      navigate("/users");
    } catch (err) {
      // Error handling is done in the mutation hooks
      console.error("Failed to save user:", err);
    }
  };

  const onCancel = () => navigate("/users");

  const validationErrors =
    userError || createUserMutation.error || updateUserMutation.error;

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? `Edit User${user.name ? `: ${user.name}` : ""}` : "New User"}
        </h1>
      </div>

      {isLoadingUser && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {validationErrors && <ErrorAlert error={validationErrors} />}

      {!isLoadingUser && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                value={user.name}
                onChange={(ev) => setUser({ ...user, name: ev.target.value })}
                placeholder="Enter name"
                required={!user.id}
                autoComplete="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                value={user.email}
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                placeholder="Enter email"
                type="email"
                required={!user.id}
                autoComplete="username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                value={user.role}
                onChange={(ev) => setUser({ ...user, role: ev.target.value })}
                required={!user.id}
                disabled={user.id}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="ADMIN">Admin</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password: ev.target.value })
                }
                placeholder={
                  user.id
                    ? "Leave empty to keep current password"
                    : "Enter password"
                }
                required={!user.id}
                autoComplete="new-password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password_confirmation: ev.target.value })
                }
                placeholder={
                  user.id
                    ? "Leave empty to keep current password"
                    : "Confirm password"
                }
                required={!user.id}
                autoComplete="new-password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {createUserMutation.isPending || updateUserMutation.isPending
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
