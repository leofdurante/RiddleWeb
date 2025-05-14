import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
} from '@chakra-ui/react'

// Temporary mock data
const mockUserData = {
  username: 'RiddleMaster',
  solvedRiddles: 42,
  totalRiddles: 100,
  streak: 7,
  achievements: [
    { name: 'First Solve', description: 'Solved your first riddle', date: '2024-03-15' },
    { name: 'Week Warrior', description: 'Solved riddles for 7 days straight', date: '2024-03-20' },
    { name: 'Logic Master', description: 'Solved 10 logic riddles', date: '2024-03-18' },
  ],
  recentActivity: [
    { type: 'solve', riddle: 'The Time Traveler', date: '2024-03-20' },
    { type: 'hint', riddle: 'The Silent Guardian', date: '2024-03-19' },
    { type: 'solve', riddle: 'The Math Wizard', date: '2024-03-18' },
  ]
}

const Profile = () => {
  const progress = (mockUserData.solvedRiddles / mockUserData.totalRiddles) * 100

  return (
    <Container maxW="container.xl">
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>{mockUserData.username}</Heading>
          <Text color="gray.600">Riddle Enthusiast</Text>
        </Box>

        {/* Progress Section */}
        <Box>
          <Heading size="md" mb={4}>Progress</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat>
              <StatLabel>Solved Riddles</StatLabel>
              <StatNumber>{mockUserData.solvedRiddles}</StatNumber>
              <StatHelpText>of {mockUserData.totalRiddles} total</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Current Streak</StatLabel>
              <StatNumber>{mockUserData.streak} days</StatNumber>
              <StatHelpText>Keep it up!</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Completion</StatLabel>
              <StatNumber>{progress.toFixed(1)}%</StatNumber>
              <Progress value={progress} colorScheme="purple" mt={2} />
            </Stat>
          </SimpleGrid>
        </Box>

        {/* Achievements Section */}
        <Box>
          <Heading size="md" mb={4}>Achievements</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {mockUserData.achievements.map((achievement, index) => (
              <Box
                key={index}
                p={4}
                bg="white"
                rounded="lg"
                shadow="sm"
                borderWidth="1px"
              >
                <HStack justify="space-between" mb={2}>
                  <Heading size="sm">{achievement.name}</Heading>
                  <Badge colorScheme="green">Earned</Badge>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  {achievement.description}
                </Text>
                <Text color="gray.500" fontSize="xs" mt={2}>
                  {achievement.date}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Recent Activity Section */}
        <Box>
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <VStack spacing={3} align="stretch">
            {mockUserData.recentActivity.map((activity, index) => (
              <Box
                key={index}
                p={3}
                bg="white"
                rounded="md"
                shadow="sm"
                borderWidth="1px"
              >
                <HStack justify="space-between">
                  <Text>
                    {activity.type === 'solve' ? '✅ Solved' : '💡 Used hint for'}{' '}
                    <Text as="span" fontWeight="bold">
                      {activity.riddle}
                    </Text>
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {activity.date}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default Profile 