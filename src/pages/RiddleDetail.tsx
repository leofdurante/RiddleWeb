import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { AIChat } from '../components/AIChat'
import { DrawingCanvas } from '../components/DrawingCanvas'
import { Calculator } from '../components/Calculator'
import { Riddle, puzzleService } from '../services/puzzleService'

const RiddleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [riddle, setRiddle] = useState<Riddle | null>(null)
  const [answer, setAnswer] = useState('')
  const [showHints, setShowHints] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const loadRiddle = async () => {
      try {
        // For now, we'll use mock riddles until we have a proper API
        const mockRiddles = puzzleService.getMockRiddles()
        const foundRiddle = mockRiddles.find(r => r.id === id)
        if (foundRiddle) {
          setRiddle(foundRiddle)
        } else {
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
        console.error('Error loading riddle:', error)
        toast({
          title: 'Error',
          description: 'Failed to load the riddle.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadRiddle()
  }, [id, navigate, toast])

  const handleSubmit = () => {
    if (!riddle) return

    if (answer.toLowerCase() === riddle.answer.toLowerCase()) {
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

  const handleGetHint = async () => {
    if (!riddle) return

    try {
      const hint = await puzzleService.getRiddleHint(riddle.riddle)
      setShowHints(true)
      setHintIndex(prev => prev + 1)
      toast({
        title: 'Hint',
        description: hint,
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get hint.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    )
  }

  if (!riddle) {
    return null
  }

  return (
    <Container maxW="container.xl">
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>{riddle.title}</Heading>
          <Box display="flex" gap={2} mb={4}>
            <Badge colorScheme="purple">{riddle.difficulty}</Badge>
            <Badge colorScheme="blue">{riddle.category}</Badge>
          </Box>
          <Text fontSize="lg" mb={6}>
            {riddle.riddle}
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
          >
            Get Hint
          </Button>
        </Box>

        <Collapse in={showHints}>
          <Box p={4} bg="gray.50" rounded="md">
            <Heading size="sm" mb={2}>Hints:</Heading>
            <Text>Use the AI Assistant tab to get more hints!</Text>
          </Box>
        </Collapse>

        <Tabs variant="enclosed" colorScheme="purple">
          <TabList>
            <Tab>AI Assistant</Tab>
            <Tab>Drawing Board</Tab>
            <Tab>Calculator</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AIChat />
            </TabPanel>
            <TabPanel>
              <DrawingCanvas />
            </TabPanel>
            <TabPanel>
              <Calculator />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  )
}

export default RiddleDetail 