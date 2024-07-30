'use client';

import * as React from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { blue, red, green } from '@mui/material/colors';

function createData(name: string, quantity: number) {
  return { name, quantity };
}

const initialRows = [
  createData('Rice', 10),
  createData('Pasta', 5),
  createData('Tomato Sauce', 3),
  createData('Olive Oil', 2),
  createData('Peanut Butter', 1),
  createData('Kusa', 1),
  createData('Mansaf', 1),
];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.editIcon': {
            color: blue[500],
            '&:hover': {
              color: blue[300],
              backgroundColor: 'rgba(33, 150, 243, 0.1)', // Lighter blue background on hover
            },
          },
          '&.deleteIcon': {
            color: red[500],
            '&:hover': {
              color: red[300],
              backgroundColor: 'rgba(244, 67, 54, 0.1)', // Lighter red background on hover
            },
            transition: 'color 0.3s, background-color 0.3s', // Smooth transition for color and background color
          },
        },
      },
    },
  },
});

const PantryList: React.FC = () => {
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState<number | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editQuantity, setEditQuantity] = React.useState<number | null>(null);
  const [error, setError] = React.useState('');
  const [isAddMode, setIsAddMode] = React.useState(false);

  const handleDelete = (name: string) => {
    setRows(rows.filter((row) => row.name !== name));
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

  const handleSave = () => {
    if (rows.some((row) => row.name === editName && currentIdx !== rows.findIndex(r => r.name === editName))) {
      setError('Item name must be unique.');
      return;
    }
    if (editName.trim() === '' || editQuantity === null || editQuantity <= 0) {
      setError('Please enter valid item details.');
      return;
    }
    if (currentIdx !== null && !isAddMode) {
      const updatedRows = rows.map((row, i) =>
        i === currentIdx ? { ...row, name: editName, quantity: editQuantity } : row
      );
      setRows(updatedRows);
    } else {
      setRows([...rows, createData(editName, editQuantity)]);
    }
    setOpen(false);
    setError('');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => handleClickOpen(null)}
          sx={{
            marginBottom: 2,
            backgroundColor: green[500],
            '&:hover': {
              backgroundColor: green[300],
            },
            borderRadius: 2, // Rounded corners
            textTransform: 'none', // Keep text as "Add Food"
          }}
        >
          Add Food
        </Button>
        <Box
          sx={{
            width: '40vw',
            height: '600px',
            margin: 'auto',
            overflow: 'auto',
            boxShadow: 3,
            borderRadius: 2,
            padding: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <List>
            {rows.map((row, idx) => (
              <ListItem
                key={row.name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px',
                  marginBottom: '8px',
                  boxShadow: 1,
                  borderRadius: 1,
                  backgroundColor: '#333232',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly lighter background color on hover
                  },
                  transition: 'background-color 0.3s',
                }}
              >
                <ListItemText
                  primary={row.name}
                  secondary={`Quantity: ${row.quantity}`}
                  primaryTypographyProps={{ fontSize: '1.2rem', color: 'text.primary' }}
                  secondaryTypographyProps={{ fontSize: '1rem', color: 'text.secondary' }}
                />
                <Box>
                  <IconButton
                    onClick={() => handleClickOpen(idx)}
                    size="large"
                    className="editIcon"
                  >
                    <EditIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(row.name)}
                    size="large"
                    className="deleteIcon"
                  >
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
          <DialogContent sx={{ backgroundColor: 'background.paper' }}>
            <DialogContentText sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
              {isAddMode
                ? 'To add a new item, please enter the name and quantity.'
                : 'To edit the item, please modify the name and quantity. The name must be unique.'}
            </DialogContentText>
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
              inputProps={{ min: 0, sx: { fontSize: '1.2rem', color: 'text.primary' } }}
              InputLabelProps={{ sx: { fontSize: '1.2rem', color: 'text.secondary' } }}
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: 'background.paper' }}>
            <Button onClick={handleClose} sx={{ fontSize: '1.2rem', color: 'text.primary' }}>
              Cancel
            </Button>
            <Button onClick={handleSave} sx={{ fontSize: '1.2rem', color: 'text.primary' }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default PantryList;
