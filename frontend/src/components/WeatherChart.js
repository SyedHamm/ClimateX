import React, { useState } from 'react';
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
import { Box, FormControlLabel, Switch, useTheme } from '@mui/material';
import { format, parseISO } from 'date-fns';

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

const WeatherChart = ({ data }) => {
  const theme = useTheme();
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(true);
  
  if (!data || data.length === 0) {
    return <div>No data available for chart</div>;
  }

  // Extract dates and temperature values with shorter format to avoid overflow
  const dates = data.map(item => {
    try {
      // Use shorter date format (M/d) for display on chart to avoid overflow
      return format(parseISO(item.date), 'M/d');
    } catch (error) {
      return item.date;
    }
  });
  const maxTemps = data.map(item => item.predicted_tmax);
  const minTemps = data.map(item => item.predicted_tmin);
  
  // Extract confidence intervals if available
  const hasMaxConfidence = data[0]?.tmax_confidence_interval;
  const hasMinConfidence = data[0]?.tmin_confidence_interval;
  
  let maxLower = [];
  let maxUpper = [];
  let minLower = [];
  let minUpper = [];
  
  if (showConfidenceIntervals) {
    if (hasMaxConfidence) {
      maxLower = data.map(item => item.tmax_confidence_interval.lower);
      maxUpper = data.map(item => item.tmax_confidence_interval.upper);
    }
    
    if (hasMinConfidence) {
      minLower = data.map(item => item.tmin_confidence_interval.lower);
      minUpper = data.map(item => item.tmin_confidence_interval.upper);
    }
  }

  // Prepare the datasets array
  const datasets = [];
  
  // Add confidence interval datasets if available and enabled
  if (showConfidenceIntervals && hasMaxConfidence) {
    datasets.push({
      label: 'Max Temp Range',
      data: maxLower,
      borderColor: 'transparent',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      pointRadius: 0,
      fill: '+1',
      tension: 0.3,
    });
    
    datasets.push({
      label: 'Max Temp Range',
      data: maxUpper,
      borderColor: 'transparent',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      pointRadius: 0,
      fill: false,
      tension: 0.3,
    });
  }
  
  // Max temperature dataset
  datasets.push({
    label: 'Max Temperature (°F)',
    data: maxTemps,
    borderColor: 'rgba(255, 99, 132, 1)',
    backgroundColor: 'rgba(255, 99, 132, 1)',
    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
    tension: 0.3,
    borderWidth: 3,
    fill: false
  });
  
  // Add confidence interval datasets for min temp if available and enabled
  if (showConfidenceIntervals && hasMinConfidence) {
    datasets.push({
      label: 'Min Temp Range',
      data: minLower,
      borderColor: 'transparent',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      pointRadius: 0,
      fill: '+1',
      tension: 0.3,
    });
    
    datasets.push({
      label: 'Min Temp Range',
      data: minUpper,
      borderColor: 'transparent',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      pointRadius: 0,
      fill: false,
      tension: 0.3,
    });
  }
  
  // Min temperature dataset
  datasets.push({
    label: 'Min Temperature (°F)',
    data: minTemps,
    borderColor: 'rgba(54, 162, 235, 1)',
    backgroundColor: 'rgba(54, 162, 235, 1)',
    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
    tension: 0.3,
    borderWidth: 3,
    fill: false
  });

  // Prepare the chart data
  const chartData = {
    labels: dates,
    datasets: datasets
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          },
          filter: (legendItem, data) => {
            // Filter out the confidence interval datasets from the legend
            return !legendItem.text.includes('Range');
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            // Try to parse and format date
            const index = context[0].dataIndex;
            try {
              return format(parseISO(data[index].date), 'MMMM d, yyyy');
            } catch (e) {
              return data[index].date;
            }
          },
          label: (context) => {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            
            // Don't show labels for the confidence interval datasets
            if (datasetLabel.includes('Range')) return null;
            
            let label = `${datasetLabel}: ${value.toFixed(1)}°F`;
            
            // Add confidence interval if available
            if (showConfidenceIntervals) {
              const index = context.dataIndex;
              if (datasetLabel.includes('Max') && hasMaxConfidence) {
                const lower = data[index].tmax_confidence_interval.lower.toFixed(1);
                const upper = data[index].tmax_confidence_interval.upper.toFixed(1);
                label += ` (${lower}°F - ${upper}°F)`;
              } else if (datasetLabel.includes('Min') && hasMinConfidence) {
                const lower = data[index].tmin_confidence_interval.lower.toFixed(1);
                const upper = data[index].tmin_confidence_interval.upper.toFixed(1);
                label += ` (${lower}°F - ${upper}°F)`;
              }
            }
            
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10
          },
          padding: 10
        },
        border: {
          display: true
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'Temperature (°F)',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 5
      },
      line: {
        borderWidth: 2
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mb: 8 }}>
      <FormControlLabel
        control={
          <Switch
            checked={showConfidenceIntervals}
            onChange={(e) => setShowConfidenceIntervals(e.target.checked)}
            color="primary"
          />
        }
        label="Show Confidence Intervals"
        sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
      />
      <Box sx={{ 
        pt: 4,
        pb: 7, // Extra bottom padding specifically for label space
        height: 'auto',
        display: 'block',
        position: 'relative'
      }}>
        <Line 
          data={chartData} 
          options={{
            ...options,
            maintainAspectRatio: false,
            layout: {
              padding: {
                bottom: 35 // Additional padding in the chart layout
              }
            }
          }} 
          height={360} // Fixed height
        />
      </Box>
    </Box>
  );
};

export default WeatherChart;
