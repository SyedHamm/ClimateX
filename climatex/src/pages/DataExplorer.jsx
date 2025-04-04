import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Pagination,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Papa from 'papaparse';

const DataExplorer = () => {
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Define column descriptions for better understanding
  const columnDescriptions = {
    Date: 'The date when the weather data was recorded',
    Temperature: 'Average temperature in Celsius (°C)',
    Humidity: 'Relative humidity percentage in the air (%)',
    Precipitation: 'Amount of rainfall in millimeters (mm)',
    WindSpeed: 'Speed of wind in kilometers per hour (km/h)',
    Pressure: 'Atmospheric pressure in hectopascals (hPa)'
  };

  // Define which columns to show (simplified view)
  const columnsToShow = ['Date', 'Temperature', 'Humidity', 'Precipitation'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/ClimateData.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setClimateData(results.data);
            setFilteredData(results.data);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (climateData) {
      let filtered = [...climateData];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(item =>
          Object.entries(item)
            .filter(([key]) => columnsToShow.includes(key))
            .some(([_, value]) =>
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }

      setFilteredData(filtered);
      setPage(1);
    }
  }, [climateData, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const paginatedData = filteredData?.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Weather Records
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search weather records"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Enter date or weather conditions..."
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columnsToShow.map((column) => (
                  <TableCell key={column}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {column}
                      <Tooltip title={columnDescriptions[column]} arrow>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData?.map((row, index) => (
                <TableRow key={index}>
                  {columnsToShow.map((column) => (
                    <TableCell key={column}>
                      {column === 'Temperature' ? `${row[column]}°C` :
                       column === 'Humidity' ? `${row[column]}%` :
                       column === 'Precipitation' ? `${row[column]}mm` :
                       row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredData?.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Understanding the Data
        </Typography>
        <Grid container spacing={2}>
          {columnsToShow.map((column) => (
            <Grid item xs={12} sm={6} key={column}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {column}
                </Typography>
                <Typography variant="body2">
                  {columnDescriptions[column]}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default DataExplorer; 