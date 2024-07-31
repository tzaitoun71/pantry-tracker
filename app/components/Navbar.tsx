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
              width: 240,
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
                  backgroundColor: vibrantTheme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: '#33d375',
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
          <IconButton onClick={toggleDrawer(true)} sx={{ position: 'fixed', top: '50%', left: 0, zIndex: 1300 }}>
            <ArrowForwardIosIcon sx={{ color: 'white', height: '100px', width: '100px', stroke: '#000', strokeWidth: 0.25, filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))'}}/>
          </IconButton>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Navbar;
