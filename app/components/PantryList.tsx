'use client';

import { useState, useEffect } from 'react';
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
  InputAdornment,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Check, Close, Search, AddPhotoAlternate } from '@mui/icons-material';
import { useUser } from '../context/UserContext';
import { db } from '../Firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import ImageCapture from './ImageCapture';

const primaryRed = '#e53935'; // Using the red shade from the image
const editDarkerGreen = '#007F4C'; // Slightly darker green color for the edit icon

const modernTheme = createTheme({
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 20px',
          transition: 'all 0.3s',
          backgroundColor: primaryRed,
          '&:hover': {
            backgroundColor: '#d32f2f',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.editIcon': {
            color: editDarkerGreen,
            '&:hover': {
              backgroundColor: 'rgba(0, 200, 83, 0.1)',
            },
          },
          '&.deleteIcon': {
            color: '#d32f2f',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 'bold',
      fontSize: '1.5rem',
      color: primaryRed,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
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
  const [filteredRows, setFilteredRows] = useState<PantryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { user } = useUser();

  const fetchPantryItems = async () => {
    if (user) {
      const q = query(collection(db, 'pantry'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const items: PantryItem[] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PantryItem));
      setRows(items);
      setFilteredRows(items); // Set the filtered rows initially to all items
    }
  };

  useEffect(() => {
    fetchPantryItems();
  }, [user]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredRows(rows);
    } else {
      setFilteredRows(rows.filter(row => row.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [searchQuery, rows]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'pantry', id));
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleClickOpen = (idx: number | null, itemName: string = '') => {
    setCurrentIdx(idx);
    if (idx !== null) {
      setEditName(rows[idx].name);
      setEditQuantity(rows[idx].quantity);
      setIsAddMode(false);
    } else {
      setEditName(itemName);
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

  const handleImageProcessed = (itemName: string) => {
    handleClickOpen(null, itemName);
    setOpenCamera(false); // Close the image capture modal after processing
  };

  return (
    <ThemeProvider theme={modernTheme}>
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
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, color: 'black' }}>
          My Pantry
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => handleClickOpen(null)}
          >
            Add Food
          </Button>
          <Button
            variant="contained"
            startIcon={<AddPhotoAlternate />}
            onClick={() => setOpenCamera(true)}
          >
            Add Food by Picture
          </Button>
        </Box>
        <TextField
          fullWidth
          placeholder="Search for food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
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
              background: '#f0f0f0',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#b0b0b0',
              borderRadius: '10px',
              border: '2px solid #f0f0f0',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#888888',
            },
          }}
        >
          <List>
            {filteredRows.map((row, idx) => (
              <ListItem
                key={row.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px',
                  marginBottom: '8px',
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
                  }}
                  secondaryTypographyProps={{
                    fontSize: '1rem',
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
          <DialogTitle>{isAddMode ? 'Add Item' : 'Edit Item'}</DialogTitle>
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
            />
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              variant="standard"
              value={editQuantity ?? ''}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <IconButton onClick={handleClose}>
              <Close color="error" />
            </IconButton>
            <IconButton onClick={handleSave}>
              <Check color="success" />
            </IconButton>
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
