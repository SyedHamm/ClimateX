import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as tf from '@tensorflow/tfjs';
import Papa from 'papaparse';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Predictions = () => {
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelLoading, setModelLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [models, setModels] = useState(null);
  const [error, setError] = useState(null);
  const [modelTrained, setModelTrained] = useState(false);

  useEffect(() => {
    // Try to load cached models first
    const cachedModels = localStorage.getItem('climateModels');
    if (cachedModels) {
      try {
        const { models, metadata } = JSON.parse(cachedModels);
        // Load models from cache
        const loadedModels = {};
        for (const metric in models) {
          loadedModels[metric] = tf.sequential();
          loadedModels[metric].loadWeights(models[metric]);
        }
        setModels({ models: loadedModels, metadata });
        setModelTrained(true);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Error loading cached models:', err);
        localStorage.removeItem('climateModels');
      }
    }

    const fetchData = async () => {
      try {
        console.log('Attempting to fetch ClimateData.csv...');
        const response = await fetch('/ClimateData.csv');
        console.log('Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('CSV text length:', csvText.length);
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('Papa Parse complete');
            console.log('Number of rows:', results.data.length);
            console.log('Fields:', results.meta.fields);
            
            if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
              setError(`Error parsing climate data: ${results.errors[0].message}`);
              setLoading(false);
              return;
            }

            if (!results.meta.fields || results.meta.fields.length === 0) {
              console.error('No fields found in CSV');
              setError('Invalid CSV format: no columns found');
              setLoading(false);
              return;
            }

            // Check if we have the required columns (TMAX and TMIN instead of TAVG)
            const requiredColumns = ['DATE', 'TMAX', 'TMIN'];
            const missingColumns = requiredColumns.filter(col => 
              !results.meta.fields.some(field => field === col)
            );

            if (missingColumns.length > 0) {
              console.error('Missing columns:', missingColumns);
              setError(`Missing required columns: ${missingColumns.join(', ')}`);
              setLoading(false);
              return;
            }

            setClimateData(results.data);
            setLoading(false);
          },
          error: (error) => {
            console.error('Papa Parse error:', error);
            setError(`Error parsing climate data: ${error.message}`);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError(`Error loading climate data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initializeModel = async () => {
    if (!climateData || climateData.length === 0) {
      setError('No climate data available');
      return;
    }

    try {
      setModelLoading(true);
      setError(null);

      // Process and validate data - only check for temperature data
      const processedData = climateData
        .filter(item => {
          const tmax = parseFloat(item.TMAX);
          const tmin = parseFloat(item.TMIN);
          const date = new Date(item.DATE);
          
          // Validate temperature ranges (in Celsius)
          const validTemp = tmax != null && tmin != null && 
                          !isNaN(tmax) && !isNaN(tmin) &&
                          tmax > -50 && tmax < 50 && // Reasonable temperature range in Celsius
                          tmin > -50 && tmin < 50 &&
                          tmin <= tmax; // Min temp should not be greater than max
          
          return validTemp && !isNaN(date.getTime());
        })
        .map(item => {
          const date = new Date(item.DATE);
          // Convert to Fahrenheit: (°C × 9/5) + 32
          const tmax = (parseFloat(item.TMAX) * 9/5) + 32;
          const tmin = (parseFloat(item.TMIN) * 9/5) + 32;
          const avgTemp = (tmax + tmin) / 2;
          
          return {
            month: date.getMonth(),
            year: date.getFullYear(),
            temperature: avgTemp,
            tmax: tmax,
            tmin: tmin
          };
        });

      // Seasonal temperature ranges for DFW (in Fahrenheit)
      const seasonalRanges = {
        // Winter (Dec-Feb)
        0: { min: 25, max: 65 }, // January
        1: { min: 30, max: 70 }, // February
        2: { min: 35, max: 75 }, // March
        // Spring (Mar-May)
        3: { min: 45, max: 80 }, // April
        4: { min: 55, max: 85 }, // May
        5: { min: 65, max: 95 }, // June
        // Summer (Jun-Aug)
        6: { min: 70, max: 100 }, // July
        7: { min: 70, max: 100 }, // August
        8: { min: 65, max: 95 }, // September
        // Fall (Sep-Nov)
        9: { min: 55, max: 85 }, // October
        10: { min: 40, max: 75 }, // November
        11: { min: 30, max: 70 }, // December
      };

      // Filter out temperatures outside seasonal ranges
      const validatedData = processedData.filter(item => {
        const range = seasonalRanges[item.month];
        return item.temperature >= range.min && item.temperature <= range.max;
      });

      if (validatedData.length === 0) {
        throw new Error('No valid temperature data found after seasonal validation');
      }

      // Group data by month to calculate averages
      const monthlyAverages = {};
      validatedData.forEach(item => {
        if (!monthlyAverages[item.month]) {
          monthlyAverages[item.month] = [];
        }
        monthlyAverages[item.month].push(item.temperature);
      });

      // Calculate average and std dev for each month
      const monthStats = {};
      for (const month in monthlyAverages) {
        const temps = monthlyAverages[month];
        const avg = temps.reduce((a, b) => a + b) / temps.length;
        const stdDev = Math.sqrt(
          temps.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / temps.length
        );
        monthStats[month] = { 
          avg, 
          stdDev,
          range: seasonalRanges[month]
        };
      }

      // Use only the last 10 years of data for better prediction
      const currentYear = new Date().getFullYear();
      const recentData = validatedData.filter(item => item.year >= currentYear - 10);

      console.log('Recent data points:', recentData.length);
      console.log('Monthly statistics:', monthStats);

      const minYear = Math.min(...recentData.map(d => d.year));
      const maxYear = Math.max(...recentData.map(d => d.year));
      const minTemp = Math.min(...recentData.map(d => d.temperature));
      const maxTemp = Math.max(...recentData.map(d => d.temperature));

      const metadata = {
        temperature: { 
          minYear, 
          maxYear, 
          minValue: minTemp, 
          maxValue: maxTemp,
          monthStats,
          seasonalRanges
        }
      };

      const xs = tf.tensor2d(recentData.map(item => [
        item.month / 11,
        (item.year - minYear) / (maxYear - minYear)
      ]));

      const ys = tf.tensor2d(recentData.map(item => [
        (item.temperature - minTemp) / (maxTemp - minTemp)
      ]));

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [2] }));
      model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 1 }));

      model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'meanSquaredError'
      });

      await model.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        shuffle: true,
        validationSplit: 0.1
      });

      const trainedModels = { temperature: model };
      const modelWeights = { 
        temperature: model.getWeights()
      };

      // Cache the models
      localStorage.setItem('climateModels', JSON.stringify({
        models: modelWeights,
        metadata
      }));

      setModels({ models: trainedModels, metadata });
      setModelLoading(false);
      setModelTrained(true);
    } catch (err) {
      console.error('Error training model:', err);
      setError(`Error training model: ${err.message}`);
      setModelLoading(false);
    }
  };

  const generatePrediction = async () => {
    if (!models) {
      try {
        await initializeModel();
      } catch (err) {
        setError('Failed to initialize model');
        return;
      }
    }

    try {
      if (!models || !selectedMonth || !selectedYear) return;

      const { models: trainedModels, metadata } = models;
      const monthIndex = months.indexOf(selectedMonth);
      
      const model = trainedModels.temperature;
      const { minYear, maxYear, minValue: minTemp, maxValue: maxTemp, monthStats, seasonalRanges } = metadata.temperature;

      const normalizedMonth = monthIndex / 11;
      const normalizedYear = (parseInt(selectedYear) - minYear) / (maxYear - minYear);

      const input = tf.tensor2d([[normalizedMonth, normalizedYear]]);
      const normalizedPrediction = await model.predict(input).data();
      
      let temperature = (
        normalizedPrediction[0] * (maxTemp - minTemp) + minTemp
      );

      // Validate prediction against seasonal ranges
      const seasonalRange = seasonalRanges[monthIndex];
      temperature = Math.max(seasonalRange.min, Math.min(seasonalRange.max, temperature));

      // Further validate against historical monthly statistics
      const monthStat = monthStats[monthIndex];
      if (monthStat) {
        const { avg, stdDev } = monthStat;
        // Clamp prediction within 2 standard deviations of the historical average
        const minAllowed = Math.max(seasonalRange.min, avg - (2 * stdDev));
        const maxAllowed = Math.min(seasonalRange.max, avg + (2 * stdDev));
        temperature = Math.max(minAllowed, Math.min(maxAllowed, temperature));
      }
      
      setPrediction({
        temperature: temperature.toFixed(1),
        month: selectedMonth,
        year: selectedYear,
        historicalAvg: monthStat ? monthStat.avg.toFixed(1) : null,
        range: seasonalRange
      });
    } catch (err) {
      console.error('Error generating prediction:', err);
      setError('Error generating prediction: ' + err.message);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear + i).toString());

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        DFW Temperature Predictions
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Date for Prediction
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={modelLoading}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={modelLoading}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={generatePrediction}
              disabled={!selectedMonth || !selectedYear || modelLoading}
              sx={{ mt: 2 }}
            >
              {modelLoading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Training Models...
                </>
              ) : modelTrained ? (
                'View Predictions'
              ) : (
                'Generate Prediction'
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {prediction && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Prediction Results
          </Typography>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h3" color="primary" gutterBottom>
              {prediction.temperature}°F
            </Typography>
            <Typography variant="subtitle1">
              Predicted temperature for {prediction.month} {prediction.year}
            </Typography>
            {prediction.historicalAvg && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Historical average: {prediction.historicalAvg}°F
              </Typography>
            )}
            {prediction.range && (
              <Typography variant="body2" color="text.secondary">
                Typical range: {prediction.range.min}°F - {prediction.range.max}°F
              </Typography>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            * This prediction is based on historical temperature patterns and may not account for extreme weather events or significant climate changes.
          </Typography>
        </Paper>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Predictions; 