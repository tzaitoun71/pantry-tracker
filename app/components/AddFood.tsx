import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

type AddFoodProps = {
  open: boolean;
  isAddMode: boolean;
  itemName: string;
  itemQuantity: number | null;
  onClose: () => void;
  onSave: (name: string, quantity: number) => void;
};

const AddFood: React.FC<AddFoodProps> = ({
  open,
  isAddMode,
  itemName,
  itemQuantity,
  onClose,
  onSave,
}) => {
  const [name, setName] = React.useState(itemName);
  const [quantity, setQuantity] = React.useState<number | null>(itemQuantity);

  React.useEffect(() => {
    setName(itemName);
    setQuantity(itemQuantity);
  }, [itemName, itemQuantity]);

  const handleSave = () => {
    if (name.trim() !== '' && quantity !== null && quantity > 0) {
      onSave(name, quantity);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isAddMode ? 'Add Item' : 'Edit Item'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Item Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          variant="standard"
          value={quantity ?? ''}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={handleSave}>
          <CheckIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddFood;
