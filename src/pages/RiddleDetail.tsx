// src/pages/RiddleDetail.tsx

// Import necessary React hooks and Chakra UI components
import { useState, useEffect } from 'react'
// Import hooks from react-router-dom for routing
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Textarea,
  useToast,
  Badge,
  Collapse,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Center,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react'
// Import custom components and services
import { AIChat } from '../components/AIChat'
import { DrawingCanvas } from '../components/DrawingCanvas'
import { Calculator } from '../components/Calculator'
// Import Riddle interface and puzzleService for data fetching
import { Riddle, puzzleService } from '../services/puzzleService'
// Import aiService for AI interactions
import { aiService } from '../services/aiService'

// RiddleDetail component to display a single riddle and related tools
const RiddleDetail = () => {
  // Get the riddle ID from the URL parameters
  const { id } = useParams()
  // Hook to navigate programmatically
  const navigate = useNavigate()
  // State to store the current riddle data
  const [riddle, setRiddle] = useState<Riddle | null>(null)
  // State to manage the visibility of hints section
  const [showHints, setShowHints] = useState(false)
  // State to track the index of the hint displayed (though we only show one now)
  const [hintIndex, setHintIndex] = useState(0)
  // State to indicate loading status
  const [isLoading, setIsLoading] = useState(true)
  // State to store the fetched hints (currently limited to one)
  const [hints, setHints] = useState<string[]>([])
  // Hook to display toast notifications
  const toast = useToast()

  // Determine background color for the hints box based on color mode
  const hintBg = useColorModeValue('gray.50', 'gray.700')
  // Determine background color for the main container based on color mode
  const containerBg = useColorModeValue('white', 'gray.800')

  // useEffect hook to load the specific riddle when the component mounts or ID changes
  useEffect(() => {
    // Async function to fetch the riddle by ID
    const loadRiddle = async () => {
      try {
        // Fetch the riddle from the database service using the ID from parameters
        const foundRiddle = await puzzleService.getRiddle(id as string)
        if (foundRiddle) {
          // Set the riddle state if found
          setRiddle(foundRiddle)
        } else {
          // Show an error toast and navigate to the riddles list if not found
          toast({
            title: 'Riddle not found',
            description: 'The riddle you are looking for does not exist.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          navigate('/riddles')
        }
      } catch (error) {
        // Log any errors during riddle loading and show an error toast
        console.error('Error loading riddle:', error)
        toast({
          title: 'Error',
          description: 'Failed to load the riddle.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        // Set loading state to false after fetching ( चाहे success हो या error )
        setIsLoading(false)
      }
    }

    // Call the loadRiddle function
    loadRiddle()
  }, [id, navigate, toast]) // Effect depends on id, navigate, and toast

  // Async function to handle getting a hint from the AI
  const handleGetHint = async () => {
    // Prevent getting a hint if riddle data is not loaded or if a hint has already been given
    if (!riddle || hints.length > 0) return

    try {
      // Fetch a hint from the AI service, passing the riddle and the number of hints already used
      const hint = await aiService.getRiddleHint(riddle, hints.length)
      // Show the hints section
      setShowHints(true)
      // Increment hint index (though not directly used to display multiple hints now)
      setHintIndex(prev => prev + 1)
      // Add the fetched hint to the hints array
      setHints(prev => [...prev, hint])
    } catch (error) {
      // Log any errors during hint fetching and show an error toast
      console.error('Error fetching hint:', error)
      toast({
        title: 'Error',
        description: 'Failed to get hint.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Show a spinner while the riddle is loading
  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  // Render the riddle detail page once loaded
  if (!riddle) {
    // Return null or a message if the riddle wasn't found (handled by toast/navigate)
    return null
  }

  return (
    // Main container with dynamic background, styling, and shadow
    <Container maxW="container.xl" bg={containerBg} borderRadius="lg" p={6} boxShadow="md">
      {/* Vertical stack for content with spacing */}
      <VStack spacing={8} align="stretch">
        {/* Box for riddle information */}
        <Box>
          {/* Riddle Title */}
          <Heading mb={2}>{riddle.title}</Heading>
          {/* Box for difficulty and category badges */}
          <Box display="flex" gap={2} mb={4}>
            {/* Difficulty Badge */}
            <Badge colorScheme="purple">{riddle.difficulty}</Badge>
            {/* Category Badge */}
            <Badge colorScheme="blue">{riddle.category}</Badge>
          </Box>
          {/* Riddle Text */}
          <Text fontSize="lg" mb={6}>
            {riddle.riddle}
          </Text>
        </Box>

        {/* Box for interactive elements like the hint button */}
        <Box>
          {/* Button to get a hint, disabled after one use */}
          <Button
            variant="outline"
            onClick={handleGetHint}
            disabled={hints.length > 0} // Disable button after one hint
          >
            Get Hint
          </Button>
        </Box>

        {/* Collapsible section to display hints */}
        <Collapse in={showHints}>
          {/* Box for hints with dynamic background */}
          <Box p={4} bg={hintBg} rounded="md">
            <Heading size="sm" mb={2}>Hints:</Heading>
            {/* Display fetched hints or a message if none yet */}
            {hints.length > 0 ? (
              // Map over the hints array to display each hint
              hints.map((hint, idx) => (
                <Text key={idx} mb={1}>{hint}</Text>
              ))
            ) : (
              // Message displayed when no hints are fetched yet
              <Text>Use the AI Assistant tab to get more hints!</Text>
            )}
          </Box>
        </Collapse>

        {/* Tabs for different tools (AI Assistant, Drawing Board, Calculator) */}
        <Tabs variant="enclosed" colorScheme="purple">
          {/* List of tabs */}
          <TabList>
            <Tab>AI Assistant</Tab>
            <Tab>Drawing Board</Tab>
            <Tab>Calculator</Tab>
          </TabList>

          {/* Panels for tab content */}
          <TabPanels>
            {/* AI Assistant tab content */}
            <TabPanel>
              {/* Render AIChat component, passing the current riddle */}
              {riddle && <AIChat riddle={riddle} />}
            </TabPanel>
            {/* Drawing Board tab content */}
            <TabPanel>
              <DrawingCanvas />
            </TabPanel>
            {/* Calculator tab content */}
            <TabPanel>
              <Calculator />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  )
}

// Export the RiddleDetail component
export default RiddleDetail