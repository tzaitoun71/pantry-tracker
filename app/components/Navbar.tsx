'use client';

import * as React from 'react';
import { Box, Drawer, IconButton, Typography, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DrawerList from './DrawerList'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useUser } from '../context/UserContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/navigation'; 

const primaryRed = '#e53935';

const vibrantTheme = createTheme({
  palette: {
    primary: {
      main: primaryRed,
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
});

const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { user, signOut } = useUser();
  const router = useRouter();

  const signOutUser = () => {
    signOut();
    router.push('/login'); // Use router.push from next/navigation
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  return (
    <ThemeProvider theme={vibrantTheme}>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          anchor="left"
          open={open}
          onClose={toggleDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280, // Increase drawer width
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              backgroundColor: 'background.paper',
              flexGrow: 1,
            }}
          >
            <IconButton onClick={toggleDrawer(false)} sx={{ alignSelf: 'flex-start' }}>
              <ArrowBackIosIcon />
            </IconButton>
            {user && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {user.displayName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {user.email}
                </Typography>
              </>
            )}
            <DrawerList />
          </Box>
          {user && (
            <Box sx={{ padding: 2, backgroundColor: 'background.paper' }}>
              <Button
                variant="contained"
                startIcon={<ExitToAppIcon />}
                onClick={signOutUser}
                sx={{
                  backgroundColor: vibrantTheme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: vibrantTheme.palette.primary.dark,
                  },
                  width: '100%',
                }}
              >
                Sign Out
              </Button>
            </Box>
          )}
        </Drawer>
        {!open && (
          <IconButton 
            onClick={toggleDrawer(true)} 
            sx={{ 
              position: 'fixed', 
              top: '50%', 
              left: 0, 
              zIndex: 1300, 
              backgroundColor: vibrantTheme.palette.primary.main, 
              color: '#fff', 
              height: '50px', 
              width: '50px', 
              borderRadius: '50%', 
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: vibrantTheme.palette.primary.dark,
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px'
            }}
          >
            <ArrowForwardIosIcon sx={{ height: '30px', width: '30px' }}/>
          </IconButton>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Navbar;
