import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors
);

const defaultData = {
  adminCount: 0,
  employeeCount: 0
};

const UserRoleChart = ({ data = defaultData }) => {
  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => ({
    labels: ['Admins', 'Employees'],
    datasets: [
      {
        data: [data.adminCount, data.employeeCount],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)', // Purple for Admins
          'rgba(59, 130, 246, 0.8)', // Blue for Employees
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }), [data.adminCount, data.employeeCount]);

  // Memoize options to prevent unnecessary recreations
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  }), []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">User Role Distribution</h3>
      <div className="h-[300px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

UserRoleChart.propTypes = {
  data: PropTypes.shape({
    adminCount: PropTypes.number,
    employeeCount: PropTypes.number
  })
};

export default React.memo(UserRoleChart); 