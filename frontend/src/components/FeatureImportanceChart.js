import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Box, useTheme } from '@mui/material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FeatureImportanceChart = ({ data, title }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return <div>No feature importance data available</div>;
  }

  // Sort data by importance and take top 10 most important features
  const sortedData = [...data].sort((a, b) => b.importance - a.importance).slice(0, 10);
  
  // Extract feature names and importance values
  const featureNames = sortedData.map(item => item.feature);
  const importanceValues = sortedData.map(item => item.importance);

  // Generate color gradient based on importance
  const backgroundColors = importanceValues.map((value, index) => {
    // Create a gradient effect for visualization
    const hue = 200; // blue
    const saturation = 90;
    const lightness = 60 - (index * 3); // Gradually darken the colors
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });

  // Prepare chart data
  const chartData = {
    labels: featureNames,
    datasets: [
      {
        label: 'Feature Importance',
        data: importanceValues,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(54, 162, 235, 0.8)',
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const options = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `Importance: ${(value * 100).toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Relative Importance',
        },
        ticks: {
          callback: function(value) {
            return (value * 100).toFixed(0) + '%';
          }
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 1 }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default FeatureImportanceChart;
