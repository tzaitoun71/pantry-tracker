'use client';

import * as React from 'react';
import { Box, IconButton, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function createData(name: string, quantity: number) {
  return { name, quantity };
}

const initialRows = [
  createData('Rice', 10),
  createData('Pasta', 5),
  createData('Tomato Sauce', 3),
  createData('Olive Oil', 2),
  createData('Peanut Butter', 1),
  createData('Rice', 10),
  createData('Pasta', 5),
  createData('Tomato Sauce', 3),
  createData('Olive Oil', 2),
  createData('Peanut Butter', 1),
  createData('Rice', 10),
  createData('Pasta', 5),
  createData('Tomato Sauce', 3),
  createData('Olive Oil', 2),
  createData('Peanut Butter', 1),
  createData('Rice', 10),
  createData('Pasta', 5),
  createData('Tomato Sauce', 3),
  createData('Olive Oil', 2),
  createData('Peanut Butter', 1),
];

const PantryList: React.FC = () => {
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState<number | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editQuantity, setEditQuantity] = React.useState<number | null>(null);
  const [error, setError] = React.useState('');

  const handleDelete = (name: string) => {
    setRows(rows.filter((row) => row.name !== name));
  };

  const handleClickOpen = (idx: number) => {
    setCurrentIdx(idx);
    setEditName(rows[idx].name);
    setEditQuantity(rows[idx].quantity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleSave = () => {
    if (rows.some((row, i) => row.name === editName && i !== currentIdx)) {
      setError('Item name must be unique.');
      return;
    }
    if (currentIdx !== null && editQuantity !== null) {
      const updatedRows = rows.map((row, i) =>
        i === currentIdx ? { ...row, name: editName, quantity: editQuantity } : row
      );
      setRows(updatedRows);
      setOpen(false);
      setError('');
    }
  };

  return (
    <Box sx={{ width: '40vw', height: '600px', margin: 'auto', overflow: 'auto' }}>
      <List>
        {rows.map((row, idx) => (
          <ListItem key={row.name} sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <ListItemText primary={row.name} secondary={`Quantity: ${row.quantity}`} 
              primaryTypographyProps={{ fontSize: '1.2rem' }}
              secondaryTypographyProps={{ fontSize: '1rem' }}
            />
            <Box>
              <IconButton onClick={() => handleClickOpen(idx)} size="large" sx={{ marginRight: 1 }}>
                <EditIcon fontSize="large" />
              </IconButton>
              <IconButton onClick={() => handleDelete(row.name)} size="large">
                <DeleteIcon fontSize="large" />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontSize: '1.5rem' }}>Edit Item</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.2rem' }}>
            To edit the item, please modify the name and quantity. The name must be unique.
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
            InputProps={{ sx: { fontSize: '1.2rem' } }}
            InputLabelProps={{ sx: { fontSize: '1.2rem' } }}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={editQuantity ?? ''}
            onChange={(e) => setEditQuantity(Number(e.target.value))}
            inputProps={{ min: 0, sx: { fontSize: '1.2rem' } }}
            InputLabelProps={{ sx: { fontSize: '1.2rem' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ fontSize: '1.2rem' }}>Cancel</Button>
          <Button onClick={handleSave} sx={{ fontSize: '1.2rem' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PantryList;
