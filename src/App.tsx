// src/App.tsx

// Import necessary React hooks and Chakra UI components
import { useEffect, useState } from 'react'
import { ChakraProvider, Box, Center, Spinner, Flex } from '@chakra-ui/react'
// Import routing components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// Import custom components and services
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RiddleList from './pages/RiddleList'
import RiddleDetail from './pages/RiddleDetail'
// Import the database initialization function
import { initializeDatabase } from './services/puzzleService'

// Main application component
function App() {
  // State to track if the database has been initialized
  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);

  // useEffect hook to run database initialization once on component mount
  useEffect(() => {
    // Test environment variables
    console.log('Environment variables test:');
    console.log('VITE_OPENAI_API_KEY exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
    console.log('VITE_OPENAI_API_KEY length:', import.meta.env.VITE_OPENAI_API_KEY?.length || 0);
    console.log('All env vars:', import.meta.env);
    
    // Initialize the IndexedDB database and populate with mock data if empty
    initializeDatabase()
      .then(() => setIsDatabaseInitialized(true)) // Set state to true on successful initialization
      .catch(console.error); // Log any errors during initialization
  }, []); // Empty dependency array means this effect runs only once on mount

  // Show a loading spinner while the database is initializing
  if (!isDatabaseInitialized) {
    return (
      <ChakraProvider>
        <Center h="100vh">
          <Spinner size="xl" color="purple.500" />
        </Center>
      </ChakraProvider>
    );
  }

  // Once database is initialized, render the main application layout and routes
  return (
    <ChakraProvider>
      {/* Router for navigation */}
      <Router>
        {/* Main layout Flex container to ensure footer stays at the bottom */}
        <Flex direction="column" minH="100vh">
          {/* Box containing Navbar and main content area, grows to fill space */}
          <Box flexGrow={1}>
            {/* Navbar component at the top */}
            <Navbar />
            {/* Container for the main content, centered and with padding */}
            <Box maxW="1200px" mx="auto" px={4} py={8}>
              {/* Define application routes */}
              <Routes>
                {/* Route for the Home page */}
                <Route path="/" element={<Home />} />
                {/* Route for the Riddle List page */}
                <Route path="/riddles" element={<RiddleList />} />
                {/* Route for individual Riddle Detail pages, with a dynamic ID parameter */}
                <Route path="/riddles/:id" element={<RiddleDetail />} />
              </Routes>
            </Box>
          </Box>
        </Flex>
      </Router>
    </ChakraProvider>
  )
}

// Export the App component
export default App
