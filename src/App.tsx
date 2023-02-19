import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Box, Typography } from '@mui/material'
import { useMasterDB } from '../hooks/useMasterDB';

function App() {
  const remoteDB = useMasterDB();
  
  // remoteDB.allDocs({include_docs: true}).then((result:any)=>console.log(result))

  return (
    <Box>
        Karan
    </Box>
  )
}

export default App
