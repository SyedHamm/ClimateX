import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&.active': {
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  maxWidth: '1200px !important',
  margin: '0 auto',
}));

function Layout({ children }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center' }}>
      <StyledAppBar position="static" sx={{ width: '100%' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              ClimateX
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <NavButton
                component={Link}
                to="/"
                className={location.pathname === '/' ? 'active' : ''}
              >
                Climate Trends
              </NavButton>
              <NavButton
                component={Link}
                to="/predictions"
                className={location.pathname === '/predictions' ? 'active' : ''}
              >
                Predictions
              </NavButton>
              <NavButton
                component={Link}
                to="/explorer"
                className={location.pathname === '/explorer' ? 'active' : ''}
              >
                Data Explorer
              </NavButton>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      <ContentContainer component="main">
        {children}
      </ContentContainer>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          width: '100%',
          backgroundColor: (theme) => theme.palette.background.paper,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            ClimateX - DFW Climate Analysis and Prediction Tool
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout; 