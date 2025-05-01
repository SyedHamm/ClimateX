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
import { Box, useTheme } from '@mui/material';
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

const HistoricalComparisonChart = ({ historicalData, forecastData }) => {
  const theme = useTheme();
  
  if (!historicalData || !forecastData || historicalData.dates.length === 0 || forecastData.length === 0) {
    return <div>No historical comparison data available</div>;
  }

  // Limit the number of days to a manageable amount (e.g., 30 days)
  const maxDays = Math.min(30, forecastData.length, historicalData.dates.length);
  
  // Format historical dates for display
  const formattedHistoricalDates = historicalData.dates.slice(0, maxDays).map(date => {
    try {
      return format(parseISO(date), 'MMM dd');
    } catch (error) {
      return date;
    }
  });
  
  // Format forecast dates for display
  const formattedForecastDates = forecastData.slice(0, maxDays).map(item => {
    try {
      return format(parseISO(item.date), 'MMM dd');
    } catch (error) {
      return item.date;
    }
  });
  
  // Extract temperature values
  const historicalMaxTemps = historicalData.tmax.slice(0, maxDays);
  const historicalMinTemps = historicalData.tmin.slice(0, maxDays);
  const forecastMaxTemps = forecastData.slice(0, maxDays).map(item => item.predicted_tmax);
  const forecastMinTemps = forecastData.slice(0, maxDays).map(item => item.predicted_tmin);
  
  // Calculate period for display
  let timeRange = "";
  try {
    const firstDate = parseISO(historicalData.dates[0]);
    const lastDate = parseISO(historicalData.dates[historicalData.dates.length - 1]);
    timeRange = `${format(firstDate, 'MMM yyyy')} - ${format(lastDate, 'MMM yyyy')}`;
  } catch (error) {
    timeRange = "Recent historical period";
  }

  // Prepare the chart data for historical data
  const historicalChartData = {
    labels: formattedHistoricalDates,
    datasets: [
      {
        label: 'Historical Max Temp',
        data: historicalMaxTemps,
        borderColor: 'rgba(255, 99, 132, 0.5)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderDash: [5, 5],
        pointStyle: 'circle',
        pointRadius: 1,
        pointHoverRadius: 4,
        tension: 0.3,
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Historical Min Temp',
        data: historicalMinTemps,
        borderColor: 'rgba(54, 162, 235, 0.5)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderDash: [5, 5],
        pointStyle: 'circle',
        pointRadius: 1,
        pointHoverRadius: 4,
        tension: 0.3,
        borderWidth: 2,
        fill: false
      }
    ]
  };
  
  // Prepare the chart data for forecast data
  const forecastChartData = {
    labels: formattedForecastDates,
    datasets: [
      {
        label: 'Forecast Max Temp',
        data: forecastMaxTemps,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.3,
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Forecast Min Temp',
        data: forecastMinTemps,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.3,
        borderWidth: 2,
        fill: false
      }
    ]
  };

  // Combine both datasets
  const combinedChartData = {
    labels: formattedForecastDates,
    datasets: [
      ...historicalChartData.datasets,
      ...forecastChartData.datasets
    ]
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
            size: 12
          },
          usePointStyle: true,
          boxWidth: 8
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
        callbacks: {
          title: (context) => {
            return context[0].label;
          }
        }
      },
      title: {
        display: true,
        text: `Forecast vs Historical Data (${timeRange})`,
        font: {
          size: 14
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
          minRotation: 45
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
      }
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 1 }}>
      <Line data={combinedChartData} options={options} />
    </Box>
  );
};

export default HistoricalComparisonChart;
