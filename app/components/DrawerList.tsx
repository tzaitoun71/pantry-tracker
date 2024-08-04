// components/DrawerList.tsx
import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';

const DrawerList: React.FC = () => {
  return (
    <List>
      <ListItem button component={Link} href="/recipes">
        <ListItemText primary="Recipes" />
      </ListItem>
    </List>
  );
};

export default DrawerList;
