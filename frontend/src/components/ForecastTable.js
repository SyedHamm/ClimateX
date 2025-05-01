import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
  tableCellClasses,
  styled
} from '@mui/material';
import { format, parseISO } from 'date-fns';

// Styled components for better table appearance
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    cursor: 'pointer',
  }
}));

const ForecastTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="text.secondary">
          No forecast data available
        </Typography>
      </Box>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format the date from ISO string to a readable format
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy (EEE)');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper} sx={{ maxHeight: 440, boxShadow: 'none' }}>
        <Table stickyHeader aria-label="forecast table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="right">Max Temp (°F)</StyledTableCell>
              <StyledTableCell align="right">Min Temp (°F)</StyledTableCell>
              <StyledTableCell align="right">Range (°F)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const tempRange = row.predicted_tmax - row.predicted_tmin;
                
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {formatDate(row.date)}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.predicted_tmax.toFixed(1)}</StyledTableCell>
                    <StyledTableCell align="right">{row.predicted_tmin.toFixed(1)}</StyledTableCell>
                    <StyledTableCell align="right">{tempRange.toFixed(1)}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ForecastTable;
