"use client";

import { Box } from "@mui/material";
import PantryList from "../components/PantryList";

const PantryListPage: React.FC = () => {
  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <div>
        <PantryList />
      </div>
    </Box>
  );
};

export default PantryListPage;
