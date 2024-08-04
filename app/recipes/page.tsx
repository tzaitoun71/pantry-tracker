'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Card, CardContent } from '@mui/material';
import { useUser } from '../context/UserContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const vibrantTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#28a745',
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
});

const RecipePage: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.uid }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch recipes. Please try again.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please try again.');
      setLoading(false);
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
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '80vw',
            maxWidth: '900px',
            height: '80vh',
            boxShadow: 3,
            borderRadius: 4,
            padding: 4,
            backgroundColor: 'background.paper',
            backdropFilter: 'blur(10px)', // Blurs the background for a modern effect
            filter: '0 4px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontSize: '36px' }}>
            Recipes
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              {recipes.length > 0 ? (
                recipes.map((recipe, index) => (
                  <Card key={index} sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Recipe {index + 1}
                      </Typography>
                      <Typography variant="body1">{recipe}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No recipes found.</Typography>
              )}
            </Box>
          )}
          <Button variant="contained" onClick={fetchRecipes} sx={{ mt: 3 }}>
            Refresh Recipes
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RecipePage;
