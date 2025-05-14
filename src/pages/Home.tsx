import { Box, Button, Container, Heading, SimpleGrid, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const Home = () => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const cardBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <Container maxW="container.xl">
      <VStack spacing={16} py={16}>
        {/* Hero Section */}
        <VStack spacing={6} textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, purple.400, pink.400)" bgClip="text">
            Welcome to RiddleMaster
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Challenge your mind with our collection of brain-teasing riddles
          </Text>
          <Button
            as={RouterLink}
            to="/riddles"
            size="lg"
            colorScheme="purple"
            px={8}
          >
            Start Solving
          </Button>
        </VStack>

        {/* Features Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
          <FeatureCard
            title="Daily Challenges"
            description="New riddles added every day to keep your mind sharp"
            icon="🎯"
          />
          <FeatureCard
            title="AI-Powered Hints"
            description="Get smart hints when you're stuck, powered by AI"
            icon="🤖"
          />
          <FeatureCard
            title="Track Progress"
            description="Monitor your solving streak and achievements"
            icon="📊"
          />
        </SimpleGrid>
      </VStack>
    </Container>
  )
}

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  const cardBg = useColorModeValue('white', 'gray.700')
  
  return (
    <Box
      p={6}
      bg={cardBg}
      rounded="xl"
      shadow="md"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
      transition="all 0.3s"
    >
      <VStack spacing={4} align="start">
        <Text fontSize="4xl">{icon}</Text>
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{description}</Text>
      </VStack>
    </Box>
  )
}

export default Home 