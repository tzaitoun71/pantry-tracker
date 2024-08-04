'use client';

import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, createTheme, ThemeProvider } from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen'; // Icon for Pantry
import ReceiptIcon from '@mui/icons-material/Receipt'; // Icon for Recipes
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

const DrawerList: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <ThemeProvider theme={vibrantTheme}>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigateTo('/pantry-list')}
            sx={{
              width: '250px',
              height: '40px',
              borderRadius: '8px',
              mb: 1,
              padding: '8px 16px',
              backgroundColor: vibrantTheme.palette.primary.main,
              '&:hover': {
                backgroundColor: vibrantTheme.palette.primary.dark,
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <KitchenIcon />
            </ListItemIcon>
            <ListItemText
              primary="Pantry"
              primaryTypographyProps={{ variant: 'body1', sx: { color: 'white', fontWeight: 'bold' } }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigateTo('/recipes')}
            sx={{
              width: '250px',
              height: '40px',
              borderRadius: '8px',
              padding: '8px 16px',
              backgroundColor: vibrantTheme.palette.primary.main,
              '&:hover': {
                backgroundColor: vibrantTheme.palette.primary.dark,
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText
              primary="Recipes"
              primaryTypographyProps={{ variant: 'body1', sx: { color: 'white', fontWeight: 'bold' } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </ThemeProvider>
  );
};

export default DrawerList;
