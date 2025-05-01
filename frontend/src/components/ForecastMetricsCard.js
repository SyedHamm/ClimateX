import React from 'react';
import { Card, CardContent, Typography, Grid, Box, LinearProgress, Divider, useTheme } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsightsIcon from '@mui/icons-material/Insights';

const ForecastMetricsCard = ({ modelData, bestModelMax, bestModelMin, metricsMax, metricsMin }) => {
  const theme = useTheme();
  
  if (!modelData || !metricsMax || !metricsMin) {
    return <div>No metrics data available</div>;
  }

  // Calculate normalized scores for visual display (0-100%)
  const normalizeScore = (r2) => {
    // R² ranges from negative infinity to 1, but typically in weather forecasting
    // values between 0.5-0.9 are common for good models
    if (r2 < 0) return 0; // Negative R² means the model is worse than the mean
    if (r2 > 1) return 100; // Shouldn't happen but just in case
    // Scale between 0-100%
    return Math.min(r2 * 100, 100);
  };
  
  const maxR2Score = normalizeScore(metricsMax.test_r2);
  const minR2Score = normalizeScore(metricsMin.test_r2);
  
  // Format accuracy as percentage based on R² score
  // This is a simplification - actual accuracy is more complex
  const maxAccuracy = Math.max(0, Math.min(100, (metricsMax.test_r2 * 100).toFixed(1)));
  const minAccuracy = Math.max(0, Math.min(100, (metricsMin.test_r2 * 100).toFixed(1)));

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssessmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h5" component="h2">
            Forecast Metrics
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Analysis of the machine learning model performance and prediction accuracy
        </Typography>
        
        <Grid container spacing={4}>
          {/* Max Temperature Metrics */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Max Temperature Model
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" fontWeight="medium">
                  Model Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="body1">
                    {bestModelMax}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Model Accuracy</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {maxAccuracy}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={maxR2Score} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 99, 132, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'rgba(255, 99, 132, 0.8)',
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">RMSE</Typography>
                  <Typography variant="body1" fontWeight="medium">{metricsMax.test_rmse.toFixed(2)}°F</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">MAE</Typography>
                  <Typography variant="body1" fontWeight="medium">{metricsMax.test_mae.toFixed(2)}°F</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">R² Score</Typography>
                  <Typography variant="body1" fontWeight="medium">{metricsMax.test_r2.toFixed(3)}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          {/* Min Temperature Metrics */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Min Temperature Model
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" fontWeight="medium">
                  Model Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="body1">
                    {bestModelMin}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Model Accuracy</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {minAccuracy}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={minR2Score} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(54, 162, 235, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'rgba(54, 162, 235, 0.8)',
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">RMSE</Typography>
                  <Typography variant="body1" fontWeight="medium">{metricsMin.test_rmse.toFixed(2)}°F</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">MAE</Typography>
                  <Typography variant="body1" fontWeight="medium">{metricsMin.test_mae.toFixed(2)}°F</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">R² Score</Typography>
                  <Typography variant="body1" fontWeight="medium">{metricsMin.test_r2.toFixed(3)}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InsightsIcon sx={{ mr: 1, color: theme.palette.info.main }} />
          <Typography variant="subtitle1" fontWeight="medium">
            What these metrics mean
          </Typography>
        </Box>
        
        <Typography variant="body2" paragraph>
          <strong>RMSE (Root Mean Square Error):</strong> The average magnitude of errors in degrees Fahrenheit. Lower is better.
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>MAE (Mean Absolute Error):</strong> The average absolute error in degrees Fahrenheit. Lower is better.
        </Typography>
        
        <Typography variant="body2">
          <strong>R² Score:</strong> How well the model explains temperature variations. Ranges from 0 to 1 (higher is better), with values above 0.7 indicating good predictive power.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ForecastMetricsCard;
