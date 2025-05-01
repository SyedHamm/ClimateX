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
import { Box, Grid, Typography, Paper, useTheme } from '@mui/material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SeasonalSummaryChart = ({ data }) => {
  const theme = useTheme();
  
  if (!data || Object.keys(data).length === 0) {
    return <div>No seasonal data available</div>;
  }

  // Extract season names and temperature values
  const seasons = Object.keys(data).map(season => 
    season.charAt(0).toUpperCase() + season.slice(1)
  );
  
  const maxTemps = Object.values(data).map(item => item.avg_tmax);
  const minTemps = Object.values(data).map(item => item.avg_tmin);
  const tempRanges = Object.values(data).map(item => item.avg_tmax - item.avg_tmin);
  
  // Define colors for each season
  const seasonColors = {
    'Winter': {
      primary: 'rgba(54, 162, 235, 0.8)',
      secondary: 'rgba(54, 162, 235, 0.4)'
    },
    'Spring': {
      primary: 'rgba(75, 192, 192, 0.8)',
      secondary: 'rgba(75, 192, 192, 0.4)'
    },
    'Summer': {
      primary: 'rgba(255, 99, 132, 0.8)',
      secondary: 'rgba(255, 99, 132, 0.4)'
    },
    'Fall': {
      primary: 'rgba(255, 159, 64, 0.8)',
      secondary: 'rgba(255, 159, 64, 0.4)'
    }
  };
  
  // Prepare background colors
  const maxTempColors = seasons.map(season => seasonColors[season]?.primary || 'rgba(54, 162, 235, 0.8)');
  const minTempColors = seasons.map(season => seasonColors[season]?.secondary || 'rgba(54, 162, 235, 0.4)');

  // Prepare chart data
  const chartData = {
    labels: seasons,
    datasets: [
      {
        label: 'Avg. Max Temperature (°F)',
        data: maxTemps,
        backgroundColor: maxTempColors,
        borderColor: maxTempColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1
      },
      {
        label: 'Avg. Min Temperature (°F)',
        data: minTemps,
        backgroundColor: minTempColors,
        borderColor: minTempColors.map(color => color.replace('0.4', '0.7')),
        borderWidth: 1
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
          afterLabel: function(context) {
            const index = context.dataIndex;
            const season = seasons[index];
            const range = tempRanges[index].toFixed(1);
            return `Temperature Range: ${range}°F`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Temperature (°F)',
        }
      }
    }
  };

  // Calculate seasonal stats
  const seasonStats = Object.entries(data).map(([season, values]) => ({
    name: season.charAt(0).toUpperCase() + season.slice(1),
    avgMax: values.avg_tmax.toFixed(1),
    avgMin: values.avg_tmin.toFixed(1),
    range: (values.avg_tmax - values.avg_tmin).toFixed(1),
    count: values.count
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: 350, p: 1 }}>
            <Bar data={chartData} options={options} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Seasonal Breakdown
            </Typography>
            <Grid container spacing={2}>
              {seasonStats.map((season, index) => (
                <Grid item xs={6} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2,
                      border: `1px solid ${seasonColors[season.name]?.primary || '#ccc'}`
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {season.name} ({season.count} days)
                    </Typography>
                    <Typography variant="body2">
                      Avg. Max: <strong>{season.avgMax}°F</strong>
                    </Typography>
                    <Typography variant="body2">
                      Avg. Min: <strong>{season.avgMin}°F</strong>
                    </Typography>
                    <Typography variant="body2">
                      Range: <strong>{season.range}°F</strong>
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SeasonalSummaryChart;
