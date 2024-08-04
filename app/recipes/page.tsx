'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Card, CardContent } from '@mui/material';
import { useUser } from '../context/UserContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';

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
    h5: {
      fontWeight: 'bold',
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
});

const RecipePage: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [pantryItems, setPantryItems] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchPantryItems();
    }
  }, [user]);

  const fetchPantryItems = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'pantry'), where('userId', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => doc.data().name);
      setPantryItems(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pantry items:', error);
      setError('Failed to fetch pantry items. Please try again.');
      setLoading(false);
    }
  };

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
            boxShadow: 4,
            borderRadius: 4,
            padding: 4,
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
            Recipes
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              {pantryItems.length === 0 ? (
                <Typography sx={{ mb: 3 }}>No items in the pantry. Please add some items to get recipe suggestions.</Typography>
              ) : (
                <>
                  <Box sx={{ flex: 1, overflowY: 'auto', padding: 2, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {recipes.length > 0 ? (
                        recipes.map((recipe, index) => (
                          <Card key={index} sx={{ boxShadow: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Recipe {index + 1}
                              </Typography>
                              <Typography variant="body1" dangerouslySetInnerHTML={{ __html: recipe.replace(/\n/g, '<br />') }} />
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Typography>No recipes found.</Typography>
                      )}
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={fetchRecipes}
                    sx={{
                      mt: 3,
                      width: '200px',
                      alignSelf: 'center',
                      backgroundColor: vibrantTheme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: vibrantTheme.palette.primary.dark,
                      },
                    }}
                  >
                    Generate Recipes
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RecipePage;
