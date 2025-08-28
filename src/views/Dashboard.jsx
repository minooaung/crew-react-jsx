import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardStats from '../components/dashboard/DashboardStats';
import UserRoleChart from '../components/dashboard/UserRoleChart';
import OrganizationGrowthChart from '../components/dashboard/OrganizationGrowthChart';
import QuickActions from '../components/dashboard/QuickActions';
import { useDashboardStats } from '../hooks/queries/useDashboard';

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardStats();

  // Debug logging
  useEffect(() => {
    if (dashboardData) {
      console.log('Dashboard Data:', dashboardData);
    }
    if (error) {
      console.error('Dashboard Error:', error);
    }
  }, [dashboardData, error]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading dashboard data
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.response?.data?.message || error.message || 'Please try again later.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              No dashboard data available
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              Please try refreshing the page.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date(dashboardData.meta.lastUpdated).toLocaleString()}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Statistics Cards */}
      <DashboardStats stats={dashboardData.stats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserRoleChart data={dashboardData.userRoles} />
        <OrganizationGrowthChart data={dashboardData.growth} />
      </div>
    </div>
  );
}
