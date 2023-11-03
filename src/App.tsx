// import './App.css';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Unstable_Grid2';
// import {useState} from 'react';

function App() {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        margin: '0 auto',
        // mb: 5,
        // mt: 2,
      }}>
      <Paper sx={{margin: '0 auto', padding: 3}}>Some stuff</Paper>
    </Container>
  );
}

export default App;
