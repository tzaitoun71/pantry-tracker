import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const DrawerList: React.FC = () => {
  return (
    <List>
      <ListItem button>
        <ListItemText primary="Item 1" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Item 2" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Item 3" />
      </ListItem>
    </List>
  );
};

export default DrawerList;
