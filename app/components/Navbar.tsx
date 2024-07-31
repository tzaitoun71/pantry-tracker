'use client';

import * as React from 'react';
import { Box, Drawer, IconButton, Typography, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DrawerList from './DrawerList'; // Import your DrawerList component
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useUser } from '../context/UserContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const vibrantTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ffcc00',
    },
    secondary: {
      main: '#00c853',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
});

const Navbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { user, signOut } = useUser();

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
              width: 240,
              boxSizing: 'border-box',
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
                <Button
                  variant="contained"
                  startIcon={<ExitToAppIcon />}
                  onClick={signOut}
                  sx={{
                    backgroundColor: vibrantTheme.palette.secondary.main,
                    '&:hover': {
                      backgroundColor: '#33d375',
                    },
                    mt: 'auto',
                    width: '100%',
                  }}
                >
                  Sign Out
                </Button>
              </>
            )}
            <DrawerList />
          </Box>
        </Drawer>
        {!open && (
          <IconButton onClick={toggleDrawer(true)} sx={{ position: 'fixed', top: '50%', left: 0, zIndex: 1300 }}>
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Navbar;