import { Box } from "@mui/material";
import PantryList from "./components/PantryList";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <div>
        <Navbar />
        <PantryList />
      </div>
    </Box>
  );
}
