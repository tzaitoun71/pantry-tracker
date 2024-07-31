'use client';

import * as React from 'react';
import { Box, Button, Typography, createTheme, ThemeProvider } from '@mui/material';
import { Google } from '@mui/icons-material';
import { signInWithPopup, auth, provider } from '../Firebase';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

const vibrantTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h5: {
      fontWeight: 'bolder',
    },
    body1: {
      fontSize: '1.2rem',
    },
  },
});

const Login: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      router.push('/pantry-list'); // Redirect to pantry list page after successful login
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <ThemeProvider theme={vibrantTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Box
          sx={{
            width: '400px',
            padding: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
            Login
          </Typography>
          <Button
            variant="contained"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            sx={{
              backgroundColor: vibrantTheme.palette.primary.main,
              '&:hover': {
                backgroundColor: vibrantTheme.palette.primary.dark,
              },
            }}
          >
            Login with Google
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
