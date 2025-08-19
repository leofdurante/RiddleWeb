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
  useToast,
  Badge,
  Center,
  Spinner,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
// Import Riddle interface and puzzleService for data fetching
import { Riddle, puzzleService } from '../services/puzzleService'
// Import aiService for AI interactions
import { aiService } from '../services/aiService'
// Import the AIChat component
import { AIChat } from '../components/AIChat'
import { DrawingCanvas } from '../components/DrawingCanvas'
import { Calculator } from '../components/Calculator'

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
  // State to indicate loading status
  const [isLoading, setIsLoading] = useState(true)
  // State to store the fetched hints (currently limited to one)
  const [hints, setHints] = useState<string[]>([])
  // State to control visibility of DrawingCanvas and Calculator
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
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
        console.log('Loading riddle with ID:', id);
        // Fetch the riddle from the database service using the ID from parameters
        const foundRiddle = await puzzleService.getRiddle(id as string)
        console.log('Found riddle:', foundRiddle);
        if (foundRiddle) {
          // Set the riddle state if found
          setRiddle(foundRiddle)
        } else {
          // Show an error toast and navigate to the riddles list if not found
          console.log('Riddle not found, navigating back to list');
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
      // Check if the AI service is initialized
      if (!(aiService as any).openai) {
        toast({
          title: 'AI Service not available',
          description: 'The AI hint service is not configured. Please ensure the necessary API key is set.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Fetch a hint from the AI service, passing the riddle and the number of hints already used
      const hint = await aiService.getRiddleHint(riddle, hints.length)
      // Show the hints section
      setShowHints(true)
      // Add the fetched hint to the hints array
      setHints(prev => [...prev, hint])
    } catch (error) {
      // Log any errors during hint fetching and show an error toast
      console.error('Error fetching hint:', error)
      let errorMessage = 'Failed to get hint.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
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
    // Return null if the riddle wasn't found (handled by toast/navigate)
    return null;
  }

  return (
    <Container 
      maxW="container.xl" 
      bg={containerBg} 
      borderRadius="lg" 
      p={{ base: 4, md: 6 }} 
      boxShadow="md"
    >
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading 
            mb={2} 
            fontSize={{ base: 'xl', md: '2xl' }}
            noOfLines={2}
          >
            {riddle.title}
          </Heading>
          <Box 
            display="flex" 
            gap={2} 
            mb={4}
            flexWrap="wrap"
          >
            <Badge colorScheme="purple">{riddle.difficulty}</Badge>
            <Badge colorScheme="blue">{riddle.category}</Badge>
          </Box>
          <Text 
            fontSize={{ base: 'md', md: 'lg' }} 
            mb={6}
            whiteSpace="pre-wrap"
          >
            {riddle.riddle}
          </Text>
        </Box>

        <Box>
          <Button
            variant="outline"
            onClick={handleGetHint}
            disabled={hints.length > 0}
            size="md"
            width={{ base: '100%', md: 'auto' }}
          >
            Get Hint
          </Button>
        </Box>

        {showHints && hints.length > 0 && (
          <Box
            p={4}
            bg={hintBg}
            borderRadius="md"
            mt={4}
          >
            <Text fontSize={{ base: 'sm', md: 'md' }}>
              {hints[0]}
            </Text>
          </Box>
        )}

        {/* Add the AIChat component here */}
        {riddle && <AIChat riddle={riddle} />}

        {/* Toggle buttons for DrawingCanvas and Calculator */}
        <Box textAlign="center" mt={4}>
          <HStack spacing={4} justify="center">
            <Button
              onClick={() => setShowDrawingCanvas(!showDrawingCanvas)}
              colorScheme="blue"
              variant={showDrawingCanvas ? "solid" : "outline"}
              leftIcon={<Box as="span" fontSize="lg">🎨</Box>}
            >
              {showDrawingCanvas ? "Hide" : "Show"} Drawing Canvas
            </Button>
            <Button
              onClick={() => setShowCalculator(!showCalculator)}
              colorScheme="green"
              variant={showCalculator ? "solid" : "outline"}
              leftIcon={<Box as="span" fontSize="lg">🧮</Box>}
            >
              {showCalculator ? "Hide" : "Show"} Calculator
            </Button>
          </HStack>
        </Box>

        {/* Conditionally show DrawingCanvas and Calculator */}
        {(showDrawingCanvas || showCalculator) && (
          <HStack spacing={8} align="start" mt={6}>
            {showDrawingCanvas && <DrawingCanvas />}
            {showCalculator && <Calculator />}
          </HStack>
        )}
      </VStack>
    </Container>
  )
}

// Export the RiddleDetail component
export default RiddleDetail