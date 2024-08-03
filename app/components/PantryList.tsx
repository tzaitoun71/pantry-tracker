'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  createTheme,
  ThemeProvider,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { blue, red, green, amber } from '@mui/material/colors';
import { useUser } from '../context/UserContext';
import { db, storage } from '../Firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ImageCapture from './ImageCapture';

const vibrantTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: amber[500],
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.editIcon': {
            color: blue[500],
            '&:hover': {
              color: blue[300],
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
            },
          },
          '&.deleteIcon': {
            color: red[500],
            '&:hover': {
              color: red[300],
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
            },
            transition: 'color 0.3s, background-color 0.3s',
          },
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
    body2: {
      fontSize: '1rem',
    },
  },
});

type PantryItem = {
  id: string;
  name: string;
  quantity: number;
  userId: string;
};

const PantryList: React.FC = () => {
  const [rows, setRows] = useState<PantryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);
  const { user } = useUser(); // Ensure user context is available

  const fetchPantryItems = async () => {
    if (user) {
      const q = query(collection(db, 'pantry'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const items: PantryItem[] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PantryItem));
      setRows(items);
    }
  };

  useEffect(() => {
    fetchPantryItems();
  }, [user]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'pantry', id));
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleClickOpen = (idx: number | null) => {
    setCurrentIdx(idx);
    if (idx !== null) {
      setEditName(rows[idx].name);
      setEditQuantity(rows[idx].quantity);
      setIsAddMode(false);
    } else {
      setEditName('');
      setEditQuantity(null);
      setIsAddMode(true);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleSave = async () => {
    if (rows.some((row) => row.name === editName && currentIdx !== rows.findIndex((r) => r.name === editName))) {
      setError('Item name must be unique.');
      return;
    }
    if (editName.trim() === '' || editQuantity === null || editQuantity <= 0) {
      setError('Please enter valid item details.');
      return;
    }

    if (user !== null) {
      if (currentIdx !== null && !isAddMode) {
        const updatedItem = { name: editName, quantity: editQuantity, userId: user.uid };
        const itemId = rows[currentIdx].id;
        await updateDoc(doc(db, 'pantry', itemId), updatedItem);
        const updatedRows = rows.map((row, i) => (i === currentIdx ? { ...updatedItem, id: itemId } : row));
        setRows(updatedRows);
      } else {
        const newItem = { name: editName, quantity: editQuantity, userId: user.uid };
        const docRef = await addDoc(collection(db, 'pantry'), newItem);
        setRows([...rows, { ...newItem, id: docRef.id }]);
      }
      setOpen(false);
      setError('');
    }
  };

  const handleImageProcessed = async (imageUrl: string) => {
    const classifyResponse = await fetch('/api/classify-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!classifyResponse.ok) {
      console.error('Failed to classify image');
      return;
    }

    const result = await classifyResponse.json();
    setEditName(result.itemName);
    handleClickOpen(null);
  };

  return (
    <ThemeProvider theme={vibrantTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 4,
          width: '80vw',
          maxWidth: '900px',
          margin: 'auto',
          boxShadow: 3,
          borderRadius: 4,
          padding: 4,
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(10px)', // Blurs the background for a modern effect
          filter: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
          My Pantry
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon sx={{ color: 'white' }} />}
          onClick={() => handleClickOpen(null)}
          sx={{
            marginBottom: 3,
            backgroundColor: vibrantTheme.palette.secondary.main,
            '&:hover': {
              backgroundColor: '#33d375',
            },
          }}
        >
          Add Food
        </Button>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon sx={{ color: 'white' }} />}
          onClick={() => setOpenCamera(true)}
          sx={{
            marginBottom: 3,
            backgroundColor: vibrantTheme.palette.secondary.main,
            '&:hover': {
              backgroundColor: '#33d375',
            },
          }}
        >
          Add Food by Picture
        </Button>
        <Box
          sx={{
            width: '100%',
            height: '60vh',
            overflow: 'auto',
            boxShadow: 3,
            borderRadius: 2,
            padding: 2,
            backgroundColor: 'background.paper',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#e0e0e0',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888888',
              borderRadius: '10px',
              border: '2px solid #e0e0e0',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555555',
            },
          }}
        >
          <List>
            {rows.map((row, idx) => (
              <ListItem
                key={row.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px',
                  marginBottom: '8px',
                  marginTop: '8px',
                  boxShadow: 1,
                  borderRadius: 1,
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  transition: 'background-color 0.3s',
                }}
              >
                <ListItemText
                  primary={row.name}
                  secondary={`Quantity: ${row.quantity}`}
                  primaryTypographyProps={{
                    fontSize: '1.2rem',
                    color: 'text.primary',
                  }}
                  secondaryTypographyProps={{
                    fontSize: '1rem',
                    color: 'text.secondary',
                  }}
                />
                <Box>
                  <IconButton onClick={() => handleClickOpen(idx)} size="large" className="editIcon">
                    <EditIcon fontSize="large" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.id)} size="large" className="deleteIcon">
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ fontSize: '1.5rem', color: 'text.primary' }}>
            {isAddMode ? 'Add Item' : 'Edit Item'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Item Name"
              type="text"
              fullWidth
              variant="standard"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              error={!!error}
              helperText={error}
              InputProps={{ sx: { fontSize: '1.2rem', color: 'text.primary' } }}
              InputLabelProps={{ sx: { fontSize: '1.2rem', color: 'text.secondary' } }}
            />
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              variant="standard"
              value={editQuantity ?? ''}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
              inputProps={{
                min: 0,
                sx: { fontSize: '1.2rem', color: 'text.primary' },
              }}
              InputLabelProps={{ sx: { fontSize: '1.2rem', color: 'text.secondary' } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>

        {openCamera && (
          <ImageCapture onImageProcessed={handleImageProcessed} onClose={() => setOpenCamera(false)} />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default PantryList;
