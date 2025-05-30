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
  Button,
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
        // Fetch all riddles from the database service
        const fetchedRiddles = await puzzleService.getAllRiddles()
        // Update the riddles state with fetched data
        setRiddles(fetchedRiddles)
      } catch (error) {
        // Log any errors during riddle loading
        console.error('Error loading riddles:', error)
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
          <Box display="flex" gap={4} flexWrap="wrap">
            {/* Search Input */}
            <Box position="relative" maxW="300px">
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
              />
            </Box>
            
            {/* Difficulty Filter */}
            <Select
              maxW="200px"
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
              maxW="200px"
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
          {/* Display filtered riddles in a responsive grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {filteredRiddles.map((riddle) => (
              // Each riddle as a clickable Box linking to the detail page
              <Box
                key={riddle.id}
                p={6}
                bg={cardBg} // Dynamic background based on color mode
                rounded="lg"
                shadow="md"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} // Hover effect
                transition="all 0.2s"
                as={RouterLink}
                to={`/riddles/${riddle.id}`}
              >
                {/* Stack for riddle content within the card */}
                <Stack gap={3}>
                  {/* Riddle Title */}
                  <Heading size="md" color="purple.600">{riddle.title}</Heading>
                  {/* Riddle Text with truncated display */}
                  <Text color={useColorModeValue('gray.600', 'gray.300')} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {riddle.riddle}
                  </Text>
                  {/* Badges for Difficulty and Category */}
                  <Box display="flex" gap={2}>
                    <Badge colorScheme="purple">{riddle.difficulty}</Badge>
                    <Badge colorScheme="blue">{riddle.category}</Badge>
                  </Box>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </Container>
  )
}

// Export the RiddleList component
export default RiddleList