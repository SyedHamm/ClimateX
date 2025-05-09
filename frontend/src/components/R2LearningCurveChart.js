import React from 'react';
import { Line } from 'react-chartjs-2';
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
import { Box, Typography, useTheme } from '@mui/material';

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

const R2LearningCurveChart = ({ maxData, minData, title }) => {
  const theme = useTheme();
  
  if (!maxData || !minData || !maxData.train_sizes || !minData.train_sizes) {
    return <div>No R² learning curve data available</div>;
  }

  // Format training sizes as percentages for display
  const labels = maxData.train_sizes.map(size => `${Math.round(size * 100)}%`);
  
  // Prepare chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Max Temperature Model',
        data: maxData.r2_scores,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.3,
        fill: false
      },
      {
        label: 'Min Temperature Model',
        data: minData.r2_scores,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.3,
        fill: false
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: R² = ${context.raw.toFixed(3)}`;
          }
        }
      },
      title: {
        display: title ? true : false,
        text: title || 'R² Learning Curve',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: 'R² Score',
        },
        ticks: {
          callback: function(value) {
            return value.toFixed(2);
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Training Data Size',
        }
      }
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This chart shows how the model's R² score improves as more training data is used. Higher R² values indicate better predictive performance.
      </Typography>
      <Box sx={{ height: 350 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default R2LearningCurveChart;
