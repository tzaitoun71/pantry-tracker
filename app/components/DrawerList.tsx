import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const DrawerList: React.FC = () => {
  return (
    <List>
      <ListItem button>
        <ListItemText primary="Recipes" />
      </ListItem>
    </List>
  );
};

export default DrawerList;
