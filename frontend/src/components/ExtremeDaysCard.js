import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Divider, useTheme } from '@mui/material';
import { format, parseISO } from 'date-fns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const ExtremeDaysCard = ({ extremeDays, weatherEmoji }) => {
  const theme = useTheme();
  
  if (!extremeDays || !extremeDays.hottest || !extremeDays.coldest) {
    return <div>No extreme days data available</div>;
  }

  // Format dates
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const hottestDay = extremeDays.hottest;
  const coldestDay = extremeDays.coldest;
  
  const hottestDate = formatDate(hottestDay.date);
  const coldestDate = formatDate(coldestDay.date);
  
  // Get weather condition and emoji
  const hottestCondition = hottestDay.weather_condition || '';
  const coldestCondition = coldestDay.weather_condition || '';
  
  const hottestEmoji = weatherEmoji[hottestCondition] || '🌡️';
  const coldestEmoji = weatherEmoji[coldestCondition] || '❄️';

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Extreme Temperature Days
        </Typography>
        
        <Grid container spacing={2}>
          {/* Hottest Day */}
          <Grid item xs={12} sm={6}>
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'rgba(255, 99, 132, 0.1)',
                border: '1px solid rgba(255, 99, 132, 0.3)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WbSunnyIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Hottest Day {hottestEmoji}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {hottestDate}
              </Typography>
              
              <Typography variant="h4" color="error" sx={{ my: 1, fontWeight: 'bold' }}>
                {hottestDay.predicted_tmax.toFixed(1)}°F
              </Typography>
              
              <Typography variant="body2">
                Min: {hottestDay.predicted_tmin.toFixed(1)}°F
              </Typography>
              
              <Typography variant="body2" sx={{ mt: 'auto', textTransform: 'capitalize' }}>
                {hottestCondition.replace('_', ' ')}
              </Typography>
            </Box>
          </Grid>
          
          {/* Coldest Day */}
          <Grid item xs={12} sm={6}>
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'rgba(54, 162, 235, 0.1)',
                border: '1px solid rgba(54, 162, 235, 0.3)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AcUnitIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Coldest Day {coldestEmoji}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {coldestDate}
              </Typography>
              
              <Typography variant="h4" color="primary" sx={{ my: 1, fontWeight: 'bold' }}>
                {coldestDay.predicted_tmin.toFixed(1)}°F
              </Typography>
              
              <Typography variant="body2">
                Max: {coldestDay.predicted_tmax.toFixed(1)}°F
              </Typography>
              
              <Typography variant="body2" sx={{ mt: 'auto', textTransform: 'capitalize' }}>
                {coldestCondition.replace('_', ' ')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExtremeDaysCard;
