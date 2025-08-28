import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import {
  useOrganisations,
  useDeleteOrganisation,
} from "../hooks/queries/useOrganisations";
import ErrorAlert from "../components/reusable/ErrorAlert";
import Button from "../components/reusable/Button";

export default function Organisations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleError, setVisibleError] = useState(null);

  const {
    data: organisationsData,
    isLoading,
    error: organisationsQueryError,
  } = useOrganisations(currentPage, searchQuery);

  const deleteOrganisationMutation = useDeleteOrganisation();

  const handlePageChange = (url) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      setCurrentPage(Number(page));
    }
  };

  // Wrapping search query update in debounce
  const handleSearchChange = debounce((value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  }, 1100);

  const onDelete = async (org) => {
    if (!window.confirm(`Are you sure you want to delete [${org.name}]?`)) {
      return;
    }

    try {
      await deleteOrganisationMutation.mutateAsync(org.id);
    } catch (err) {
      // Error handling is done in the mutation hooks
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    const mergedError =
      organisationsQueryError || deleteOrganisationMutation.error;
    if (mergedError) {
      setVisibleError(mergedError);
      // Automatically clear the error after 3 seconds
      const timeout = setTimeout(() => setVisibleError(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [organisationsQueryError, deleteOrganisationMutation.error]);

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            All Organisations
          </h1>
        </div>
        <div>
          <Button
            variant="primary"
            to="/organisations/new"
          >
            Add new organisation
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="search"
          name="search"
          id="search"
          className="block w-72 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Type to search organisations..."
          onChange={(ev) => handleSearchChange(ev.target.value)}
        />
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {visibleError && <ErrorAlert error={visibleError} />}

      {!isLoading && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Users Count
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Create Date
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              {organisationsData && (
                <tbody className="divide-y divide-gray-200 bg-white">
                  {organisationsData.data.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700">
                        {org.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">
                        {org.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">
                        {org.users_count}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">
                        {org.created_at}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-base font-medium">
                        <Link
                          to={"/organisations/" + org.id}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <Button
                          variant="danger"
                          onClick={(ev) => onDelete(org)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination */}
          {organisationsData && (
            <div>
              <div className="px-4 py-2 flex items-center justify-between sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  {organisationsData.meta.links.map((link, index) => {
                    if (link.label === "&laquo; Previous") {
                      return (
                        <Button
                          key={index}
                          variant="pagination"
                          onClick={() => handlePageChange(link.url)}
                          disabled={!link.url}
                        >
                          Previous
                        </Button>
                      );
                    }
                    if (link.label === "Next &raquo;") {
                      return (
                        <Button
                          key={index}
                          variant="pagination"
                          onClick={() => handlePageChange(link.url)}
                          disabled={!link.url}
                          className="ml-3"
                        >
                          Next
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {organisationsData.meta.from}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {organisationsData.meta.to}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {organisationsData.meta.total}
                      </span>{" "}
                      organisations
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      {organisationsData.meta.links.map((link, index) => {
                        if (link.label === "&laquo; Previous") {
                          return (
                            <Button
                              key={index}
                              variant="paginationNav"
                              onClick={() => handlePageChange(link.url)}
                              disabled={!link.url}
                              className="rounded-l-md"
                            >
                              <span className="sr-only">Previous</span>
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Button>
                          );
                        }
                        if (link.label === "Next &raquo;") {
                          return (
                            <Button
                              key={index}
                              variant="paginationNav"
                              onClick={() => handlePageChange(link.url)}
                              disabled={!link.url}
                              className="rounded-r-md"
                            >
                              <span className="sr-only">Next</span>
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Button>
                          );
                        }
                        return (
                          <Button
                            key={index}
                            variant={link.active ? "paginationActive" : "pagination"}
                            onClick={() => handlePageChange(link.url)}
                            disabled={!link.url}
                            className={!link.url ? "cursor-not-allowed" : ""}
                          >
                            <span
                              dangerouslySetInnerHTML={{ __html: link.label }}
                            ></span>
                          </Button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
