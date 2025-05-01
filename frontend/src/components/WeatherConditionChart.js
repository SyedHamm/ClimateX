import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Box, useTheme } from '@mui/material';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const WeatherConditionChart = ({ data }) => {
  const theme = useTheme();
  
  if (!data || Object.keys(data).length === 0) {
    return <div>No weather condition data available</div>;
  }

  // Extract condition names and counts
  const conditionNames = Object.keys(data).map(key => {
    // Format condition names for display
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  });
  const conditionCounts = Object.values(data);

  // Get weather condition colors from theme
  const backgroundColors = Object.keys(data).map(condition => {
    switch (condition) {
      case 'freezing': return theme.palette.weather.freezing;
      case 'cold': return theme.palette.weather.cold;
      case 'cool': return theme.palette.weather.cool;
      case 'mild': return theme.palette.weather.mild;
      case 'warm': return theme.palette.weather.warm;
      case 'hot': return theme.palette.weather.hot;
      case 'very_hot': return theme.palette.weather.very_hot;
      default: return '#CCCCCC';
    }
  });

  // Prepare chart data
  const chartData = {
    labels: conditionNames,
    datasets: [
      {
        data: conditionCounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color),
        borderWidth: 1,
        hoverOffset: 10
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          boxWidth: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} days (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    layout: {
      padding: 10
    }
  };

  return (
    <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', p: 1 }}>
      <Doughnut data={chartData} options={options} />
    </Box>
  );
};

export default WeatherConditionChart;
