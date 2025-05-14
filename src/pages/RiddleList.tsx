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
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { Riddle, puzzleService } from '../services/puzzleService'

const RiddleList = () => {
  const [riddles, setRiddles] = useState<Riddle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [difficulty, setDifficulty] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRiddles = async () => {
      try {
        // For now, we'll use mock riddles until we have a proper API
        const mockRiddles = puzzleService.getMockRiddles()
        setRiddles(mockRiddles)
      } catch (error) {
        console.error('Error loading riddles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRiddles()
  }, [])

  const filteredRiddles = riddles.filter((riddle) => {
    const matchesSearch = riddle.riddle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficulty === 'all' || riddle.difficulty === difficulty
    const matchesCategory = category === 'all' || riddle.category === category
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  return (
    <Container maxW="container.xl">
      <Stack gap={8}>
        <Heading>Riddles</Heading>
        
        {/* Filters */}
        <Box display="flex" gap={4} flexWrap="wrap">
          <Box position="relative" maxW="300px">
            <Box
              position="absolute"
              left="3"
              top="50%"
              transform="translateY(-50%)"
              pointerEvents="none"
            >
              <SearchIcon color="gray.300" />
            </Box>
            <Input
              pl="10"
              placeholder="Search riddles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {filteredRiddles.map((riddle) => (
            <Box
              key={riddle.id}
              p={6}
              bg="white"
              rounded="lg"
              shadow="md"
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
              as={RouterLink}
              to={`/riddles/${riddle.id}`}
            >
              <Stack gap={3}>
                <Text color="gray.600" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {riddle.riddle}
                </Text>
                <Box display="flex" gap={2}>
                  <Badge colorScheme="purple">{riddle.difficulty}</Badge>
                  <Badge colorScheme="blue">{riddle.category}</Badge>
                </Box>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}

export default RiddleList 