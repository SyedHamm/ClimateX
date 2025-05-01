import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  useTheme,
  ThemeProvider,
  createTheme,
  Grid,
  Tab,
  Tabs,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  TextField
} from '@mui/material';
// Using standard date input instead of Material-UI DatePicker
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import BarChartIcon from '@mui/icons-material/BarChart';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Import components
import WeatherChart from './components/WeatherChart';
import ForecastTable from './components/ForecastTable';
import ModelComparisonChart from './components/ModelComparisonChart';
import FeatureImportanceChart from './components/FeatureImportanceChart';
import WeatherConditionChart from './components/WeatherConditionChart';
import SeasonalSummaryChart from './components/SeasonalSummaryChart';
import HistoricalComparisonChart from './components/HistoricalComparisonChart';
import ExtremeDaysCard from './components/ExtremeDaysCard';
import ForecastMetricsCard from './components/ForecastMetricsCard';

import './App.css';
import axios from 'axios';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // blue
    },
    secondary: {
      main: '#ff9800', // orange
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    weather: {
      freezing: '#4169E1',  // Royal Blue
      cold: '#87CEEB',     // Sky Blue
      cool: '#90EE90',     // Light Green
      mild: '#FFFF99',     // Light Yellow
      warm: '#FFD700',     // Gold
      hot: '#FFA500',      // Orange
      very_hot: '#FF4500'   // Red Orange
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
          padding: '10px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 15px rgba(50, 50, 93, 0.1), 0 5px 8px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 10px rgba(50, 50, 93, 0.05), 0 3px 5px rgba(0, 0, 0, 0.04)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': {
            paddingBottom: 20,
          },
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        },
      },
    },
  },
});

function App() {
  const [forecastData, setForecastData] = useState(null);
  const [modelData, setModelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const generateForecast = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      let url = '/api/forecast';
      const params = {};
      
      // Add start_date if selected
      if (selectedDate) {
        // Format date as YYYY-MM-DD
        const formattedDate = selectedDate.toISOString().split('T')[0];
        params.start_date = formattedDate;
      }
      
      // Make API request with params
      const response = await axios.get(url, { params });
      
      if (response.data.success) {
        // Store both forecast and model data
        setForecastData(response.data.data.forecast);
        setModelData(response.data.data.models);
        setShowSnackbar(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching forecast data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  // Weather condition emoji mapping
  const weatherEmoji = {
    'freezing': '❄️',
    'cold': '🥶',
    'cool': '😎',
    'mild': '🌤️',
    'warm': '☀️',
    'hot': '🔥',
    'very_hot': '🥵'
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <CloudIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              ClimateX
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 4
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                letterSpacing: '0.5px'
              }} 
              gutterBottom
            >
              90-Day Weather Forecast {selectedDate ? `from ${new Date(selectedDate.getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString()}` : ''}
            </Typography>
            <Typography variant="subtitle1" component="p" sx={{ mb: 3, textAlign: 'center', maxWidth: '700px', mx: 'auto', fontStyle: 'italic', color: 'text.secondary' }}>
              Using historic NOAA data from the Dallas area and processing it through advanced machine learning algorithms to generate accurate temperature predictions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3, alignItems: 'center' }}>
              <TextField
                label="Forecast Start Date"
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                helperText="Select a date to start the forecast from"
                sx={{ minWidth: '250px' }}
                InputLabelProps={{ shrink: true }}
              />
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={generateForecast}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <TimelineIcon />}
                sx={{ py: 1.5, px: 4, borderRadius: 2 }}
              >
                {isLoading ? 'Generating Forecast...' : 'Run Weather Forecast'}
              </Button>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {forecastData && modelData && !isLoading && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  aria-label="forecast tabs"
                >
                  <Tab icon={<ThermostatIcon />} label="Forecast" />  
                  <Tab icon={<AssessmentIcon />} label="Analysis" />
                  <Tab icon={<BarChartIcon />} label="ML Models" />
                  <Tab icon={<DataUsageIcon />} label="Data Table" />
                </Tabs>
              </Box>
              
              {/* Forecast Tab */}
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Temperature Forecast
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        90-day temperature forecast showing predicted maximum and minimum temperatures with confidence intervals
                      </Typography>
                      <Box sx={{ height: 400, mt: 1 }}>
                        <WeatherChart data={forecastData.daily_forecast} />
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <ExtremeDaysCard extremeDays={forecastData.extreme_days} weatherEmoji={weatherEmoji} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Weather Conditions Distribution
                        </Typography>
                        <WeatherConditionChart data={forecastData.condition_counts} />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Seasonal Temperature Summary
                      </Typography>
                      <SeasonalSummaryChart data={forecastData.seasonal_summary} />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Historical Comparison
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Forecasted temperatures compared with historical data from the same period
                      </Typography>
                      <Box sx={{ height: 400 }}>
                        <HistoricalComparisonChart 
                          historicalData={forecastData.historical_data} 
                          forecastData={forecastData.daily_forecast.slice(0, 30)} 
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              
              {/* Analysis Tab */}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <ForecastMetricsCard 
                      modelData={modelData}
                      bestModelMax={modelData.best_model_max}
                      bestModelMin={modelData.best_model_min}
                      metricsMax={modelData.metrics_max}
                      metricsMin={modelData.metrics_min}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Max Temperature Feature Importance
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Most influential factors for maximum temperature prediction
                      </Typography>
                      <Box sx={{ height: 350 }}>
                        <FeatureImportanceChart 
                          data={modelData.feature_importance_max} 
                          title="Max Temperature Predictors"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Min Temperature Feature Importance
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Most influential factors for minimum temperature prediction
                      </Typography>
                      <Box sx={{ height: 350 }}>
                        <FeatureImportanceChart 
                          data={modelData.feature_importance_min} 
                          title="Min Temperature Predictors"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              
              {/* ML Models Tab */}
              {activeTab === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Max Temperature Model Comparison
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Performance metrics of different machine learning models for maximum temperature prediction
                      </Typography>
                      <ModelComparisonChart 
                        data={modelData.model_comparison_max} 
                        title="Max Temperature Models"
                        bestModel={modelData.best_model_max}
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Min Temperature Model Comparison
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Performance metrics of different machine learning models for minimum temperature prediction
                      </Typography>
                      <ModelComparisonChart 
                        data={modelData.model_comparison_min} 
                        title="Min Temperature Models"
                        bestModel={modelData.best_model_min}
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        Model Performance Details
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        This forecast uses multiple machine learning models to find the best prediction accuracy. The system automatically selects the best performing model based on test error metrics.
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom>
                            Max Temperature Model: {modelData.best_model_max}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              <strong>Test RMSE:</strong> {modelData.metrics_max.test_rmse.toFixed(2)}°F
                            </Typography>
                            <Typography variant="body2">
                              <strong>R² Score:</strong> {modelData.metrics_max.test_r2.toFixed(3)}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Mean Absolute Error:</strong> {modelData.metrics_max.test_mae.toFixed(2)}°F
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom>
                            Min Temperature Model: {modelData.best_model_min}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              <strong>Test RMSE:</strong> {modelData.metrics_min.test_rmse.toFixed(2)}°F
                            </Typography>
                            <Typography variant="body2">
                              <strong>R² Score:</strong> {modelData.metrics_min.test_r2.toFixed(3)}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Mean Absolute Error:</strong> {modelData.metrics_min.test_mae.toFixed(2)}°F
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Model Features Used:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {modelData.feature_importance_max.slice(0, 10).map((feature, index) => (
                          <Box key={index} sx={{ 
                            bgcolor: 'primary.light', 
                            color: 'white', 
                            py: 0.5, 
                            px: 1.5, 
                            borderRadius: 4,
                            fontSize: '0.85rem'
                          }}>
                            {feature.feature}
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              
              {/* Data Table Tab */}
              {activeTab === 3 && (
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Forecast Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Detailed daily forecast data for the next 90 days
                  </Typography>
                  <ForecastTable data={forecastData.daily_forecast} />
                </Paper>
              )}
            </Box>
          )}
        </Container>
        
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            Forecast generated successfully!
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;
