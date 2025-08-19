// src/pages/RiddleList.tsx

// Import necessary React hooks and Chakra UI components
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Input,
  Stack,
  Text,
  Badge,
  Select,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react'
// Import icons from Chakra UI
import { SearchIcon } from '@chakra-ui/icons'
// Import Link component from react-router-dom for navigation
import { Link as RouterLink } from 'react-router-dom'
// Import Riddle interface and puzzleService for data fetching
import { Riddle, puzzleService } from '../services/puzzleService'

// RiddleList component to display a list of riddles
const RiddleList = () => {
  // State to store the list of riddles
  const [riddles, setRiddles] = useState<Riddle[]>([])
  // State for the search term input
  const [searchTerm, setSearchTerm] = useState('')
  // State for filtering by difficulty
  const [difficulty, setDifficulty] = useState<string>('all')
  // State for filtering by category
  const [category, setCategory] = useState<string>('all')
  // State to indicate loading status
  const [isLoading, setIsLoading] = useState(true)

  // Determine background color for riddle cards based on color mode
  const cardBg = useColorModeValue('white', 'gray.700')

  // useEffect hook to load riddles when the component mounts
  useEffect(() => {
    // Async function to fetch riddles
    const loadRiddles = async () => {
      try {
        console.log('Loading riddles...')
        // Fetch all riddles from the database service
        const fetchedRiddles = await puzzleService.getAllRiddles()
        console.log('Fetched riddles:', fetchedRiddles)
        // Update the riddles state with fetched data
        setRiddles(fetchedRiddles)
      } catch (error) {
        // Log any errors during riddle loading
        console.error('Error loading riddles:', error)
        // Fallback to mock data if Firestore fails
        console.log('Falling back to mock data...')
        const { mockRiddles } = await import('../services/puzzleService')
        setRiddles(mockRiddles)
      } finally {
        // Set loading state to false after fetching ( चाहे success हो या error )
        setIsLoading(false)
      }
    }

    // Call the loadRiddles function
    loadRiddles()
  }, []) // Empty dependency array means this effect runs only once on mount

  // Filter the riddles based on search term, difficulty, and category
  const filteredRiddles = riddles.filter((riddle) => {
    // Check if the riddle text includes the search term (case-insensitive)
    const matchesSearch = riddle.riddle.toLowerCase().includes(searchTerm.toLowerCase())
    // Check if the riddle difficulty matches the selected difficulty filter
    const matchesDifficulty = difficulty === 'all' || riddle.difficulty === difficulty
    // Check if the riddle category matches the selected category filter
    const matchesCategory = category === 'all' || riddle.category === category
    // Return true if all filters match
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  // Show a spinner while the riddles are loading
  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  // Render the list of riddles once loaded
  return (
    // Main container with background image and styling
    <Container
      maxW="container.xl"
      // Removed background image styles
      minH="calc(100vh - 80px)" // Ensure content area has minimum height
      position="relative" // Needed for positioning content on top
      overflow="hidden" // Keep overflow hidden if content might exceed container
    >
      {/* Inner box to contain content and ensure it's above the background */}
      <Box position="relative" zIndex={1}>
        <Stack gap={8}>
          <Heading>Riddles</Heading>
          
          {/* Filters Section */}
          <Box 
            display="flex" 
            gap={4} 
            flexWrap="wrap"
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'stretch', md: 'center' }}
          >
            {/* Search Input */}
            <Box position="relative" w={{ base: '100%', md: '300px' }}>
              {/* Search Icon */}
              <Box
                position="absolute"
                left="3"
                top="50%"
                transform="translateY(-50%)"
                pointerEvents="none"
              >
                <SearchIcon color="gray.300" />
              </Box>
              {/* Input field for searching */}
              <Input
                pl="10"
                placeholder="Search riddles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                w="100%"
              />
            </Box>
            
            {/* Difficulty Filter */}
            <Select
              w={{ base: '100%', md: '200px' }}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
            
            {/* Category Filter */}
            <Select
              w={{ base: '100%', md: '200px' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="wordplay">Word Play</option>
              <option value="logic">Logic</option>
              <option value="objects">Objects</option>
            </Select>
          </Box>

          {/* Riddle Grid */}
          <SimpleGrid 
            columns={{ base: 1, sm: 2, lg: 3 }} 
            gap={6}
            spacing={6}
            px={{ base: 2, md: 4 }}
          >
            {filteredRiddles.map((riddle) => {
              console.log('Rendering riddle:', riddle.title, 'with ID:', riddle.id);
              return (
                <Box
                  key={riddle.id}
                  p={{ base: 4, md: 6 }}
                  bg={cardBg}
                  rounded="lg"
                  shadow="md"
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                  as={RouterLink}
                  to={`/riddles/${riddle.id}`}
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  cursor="pointer"
                >
                  <Stack gap={3} flex="1">
                  <Heading size="md" color="purple.600" noOfLines={2}>
                    {riddle.title}
                  </Heading>
                  <Text 
                    color={useColorModeValue('gray.600', 'gray.300')} 
                    noOfLines={3}
                    flex="1"
                  >
                    {riddle.riddle}
                  </Text>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Badge colorScheme="purple">{riddle.difficulty}</Badge>
                    <Badge colorScheme="blue">{riddle.category}</Badge>
                  </Box>
                </Stack>
                </Box>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Box>
    </Container>
  )
}

// Export the RiddleList component
export default RiddleList