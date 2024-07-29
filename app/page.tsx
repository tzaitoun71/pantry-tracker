import { Box } from "@mui/material";
import BasicTable from "./components/BasicTable";


export default function Home() {
  return (
    <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
    >
      <BasicTable />
    </Box>
  );
}
