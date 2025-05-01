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
import { Box, Typography, useTheme } from '@mui/material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ModelComparisonChart = ({ data, title, bestModel }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return <div>No model comparison data available</div>;
  }

  // Extract model names and metrics
  const modelNames = data.map(item => item.model);
  const testRMSE = data.map(item => item.test_rmse);
  const trainRMSE = data.map(item => item.train_rmse);
  const r2Scores = data.map(item => item.r2_score);

  // Generate background colors based on whether it's the best model
  const backgroundColors = modelNames.map(model => 
    model === bestModel 
      ? 'rgba(75, 192, 192, 0.8)' // Highlight the best model
      : 'rgba(54, 162, 235, 0.6)'
  );

  // Prepare chart data
  const chartData = {
    labels: modelNames,
    datasets: [
      {
        label: 'Test RMSE (lower is better)',
        data: testRMSE,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const index = context.dataIndex;
            const model = modelNames[index];
            return [
              `Train RMSE: ${trainRMSE[index].toFixed(2)}`,
              `R² Score: ${r2Scores[index].toFixed(3)}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'RMSE Value',
        }
      }
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 1 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {bestModel && (
          <Typography variant="subtitle2" color="text.secondary">
            Best model: <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>{bestModel}</Box>
          </Typography>
        )}
      </Box>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default ModelComparisonChart;
