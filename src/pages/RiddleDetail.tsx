import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Textarea,
  useToast,
  Badge,
  Collapse,
  IconButton,
} from '@chakra-ui/react'

// Temporary mock data
const mockRiddle = {
  id: 1,
  title: 'The Time Traveler',
  difficulty: 'Hard',
  category: 'Logic',
  description: 'I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by everyone. What am I?',
  answer: 'pencil lead',
  hints: [
    'Think about something that comes from the ground',
    'It\'s commonly used for writing',
    'It\'s made of a specific element'
  ]
}

const RiddleDetail = () => {
  const { id } = useParams()
  const [answer, setAnswer] = useState('')
  const [showHints, setShowHints] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const toast = useToast()

  const handleSubmit = () => {
    if (answer.toLowerCase() === mockRiddle.answer.toLowerCase()) {
      toast({
        title: 'Correct!',
        description: 'You solved the riddle!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Try again',
        description: 'That\'s not quite right. Keep thinking!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleGetHint = () => {
    if (hintIndex < mockRiddle.hints.length) {
      setShowHints(true)
      setHintIndex(prev => prev + 1)
    } else {
      toast({
        title: 'No more hints',
        description: 'You\'ve used all available hints!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Container maxW="container.md">
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>{mockRiddle.title}</Heading>
          <Box display="flex" gap={2} mb={4}>
            <Badge colorScheme="purple">{mockRiddle.difficulty}</Badge>
            <Badge colorScheme="blue">{mockRiddle.category}</Badge>
          </Box>
          <Text fontSize="lg" mb={6}>
            {mockRiddle.description}
          </Text>
        </Box>

        <Box>
          <Textarea
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            mb={4}
          />
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            mr={4}
          >
            Submit Answer
          </Button>
          <Button
            variant="outline"
            onClick={handleGetHint}
            isDisabled={hintIndex >= mockRiddle.hints.length}
          >
            Get Hint ({hintIndex}/{mockRiddle.hints.length})
          </Button>
        </Box>

        <Collapse in={showHints}>
          <Box p={4} bg="gray.50" rounded="md">
            <Heading size="sm" mb={2}>Hints:</Heading>
            {mockRiddle.hints.slice(0, hintIndex).map((hint, index) => (
              <Text key={index} mb={2}>
                {index + 1}. {hint}
              </Text>
            ))}
          </Box>
        </Collapse>
      </VStack>
    </Container>
  )
}

export default RiddleDetail 