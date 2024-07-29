import { Box } from "@mui/material";
import PantryList from "./components/PantryList";


export default function Home() {
  return (
    <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
    >
      <PantryList />
    </Box>
  );
}
