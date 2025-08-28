import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const defaultData = {
  labels: [],
  organizations: [],
  users: []
};

const OrganizationGrowthChart = ({ data = defaultData }) => {
  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => ({
    labels: data.labels,
    datasets: [
      {
        label: 'Organizations',
        data: data.organizations,
        borderColor: 'rgba(59, 130, 246, 1)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Active Users',
        data: data.users,
        borderColor: 'rgba(147, 51, 234, 1)', // Purple
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  }), [data.labels, data.organizations, data.users]);

  // Memoize options to prevent unnecessary recreations
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyColor: '#1f2937',
        bodyFont: {
          size: 13,
        },
        borderColor: '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  }), []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Growth Overview</h3>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

OrganizationGrowthChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    organizations: PropTypes.arrayOf(PropTypes.number),
    users: PropTypes.arrayOf(PropTypes.number)
  })
};

export default React.memo(OrganizationGrowthChart); 