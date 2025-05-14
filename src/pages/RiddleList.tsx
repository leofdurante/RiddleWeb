import { useState } from 'react'
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
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

interface Riddle {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: 'Logic' | 'Word Play' | 'Math'
  description: string
}

// Temporary mock data
const mockRiddles: Riddle[] = [
  {
    id: 1,
    title: 'The Time Traveler',
    difficulty: 'Hard',
    category: 'Logic',
    description: 'I am taken from a mine and shut up in a wooden case...',
  },
  {
    id: 2,
    title: 'The Silent Guardian',
    difficulty: 'Medium',
    category: 'Word Play',
    description: 'What has keys, but no locks; space, but no room...',
  },
  {
    id: 3,
    title: 'The Math Wizard',
    difficulty: 'Easy',
    category: 'Math',
    description: 'I am a number that is equal to the sum of my digits...',
  },
]

const RiddleList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [difficulty, setDifficulty] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')

  const filteredRiddles = mockRiddles.filter((riddle) => {
    const matchesSearch = riddle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         riddle.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficulty === 'all' || riddle.difficulty === difficulty
    const matchesCategory = category === 'all' || riddle.category === category
    return matchesSearch && matchesDifficulty && matchesCategory
  })

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
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Select>
          
          <Select
            maxW="200px"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Logic">Logic</option>
            <option value="Word Play">Word Play</option>
            <option value="Math">Math</option>
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
            >
              <Stack gap={3}>
                <Heading size="md">{riddle.title}</Heading>
                <Text color="gray.600" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {riddle.description}
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