// src/pages/Home.tsx

// Import necessary Chakra UI components
import { Box, Heading, Text, Button, Stack, SimpleGrid, Icon, Container, Image, Spinner, Center, VStack, Flex, Badge, HStack, useColorModeValue, Input, IconButton } from '@chakra-ui/react';
// Import Link component from react-router-dom for navigation
import { Link as RouterLink } from 'react-router-dom';
// Import icons from react-icons (assuming you have react-icons installed and set up)
// You might need to install react-icons if you haven't: npm install react-icons @types/react-icons
// Example icons from react-icons/fi:
// import { FiTarget, FiCpu, FiTrophy } from 'react-icons/fi'; // Placeholder icons, replace with actual icons if needed
import { useState, useEffect } from 'react';
// Import the Riddle interface and puzzleService
import { Riddle, puzzleService } from '../services/puzzleService';

// Interface for the feature items on the home page
interface FeatureItemProps {
  icon?: React.ElementType; // Make icon optional
  imageSrc?: string; // Add optional image source
  title: string;
  description: string;
}

// Component for a single feature item
const FeatureItem = ({ icon, imageSrc, title, description }: FeatureItemProps) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const iconBg = useColorModeValue('purple.50', 'purple.900');
  
  return (
    <Box 
      p={6} 
      shadow="lg" 
      borderWidth="1px" 
      borderRadius="xl"
      bg={cardBg}
      transition="all 0.3s ease"
      _hover={{ 
        transform: 'translateY(-4px)', 
        shadow: '2xl',
        borderColor: 'purple.200'
      }}
      cursor="pointer"
    >
      {/* Icon or Image for the feature with enhanced styling */}
      <Box 
        bg={iconBg}
        borderRadius="full"
        p={3}
        mb={4}
        mx="auto"
        w="80px"
        h="80px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="md"
      >
        {imageSrc ? (
          <Image src={imageSrc} alt={`${title} icon`} boxSize="50px" />
        ) : (
          <Icon as={icon} w={10} h={10} color="purple.500" />
        )}
      </Box>
      {/* Title of the feature */}
      <Heading as="h3" size="md" mb={3} color="purple.600" _dark={{ color: "purple.300" }}>
        {title}
      </Heading>
      {/* Description of the feature */}
      <Text color="gray.600" _dark={{ color: "gray.300" }} lineHeight="tall">
        {description}
      </Text>
    </Box>
  );
};

// Home page component
const Home = () => {
  // State for the riddle of the day
  const [riddleOfTheDay, setRiddleOfTheDay] = useState<Riddle | null>(null);
  // State to indicate if the riddle of the day is loading
  const [isLoadingRiddle, setIsLoadingRiddle] = useState(true);
  // State for the answer input
  const [answer, setAnswer] = useState('');
  // State to show feedback
  const [showFeedback, setShowFeedback] = useState(false);
  // State to track if answer is correct
  const [isCorrect, setIsCorrect] = useState(false);

  // useEffect to fetch the riddle of the day on component mount
  useEffect(() => {
    const fetchRiddleOfTheDay = async () => {
      setIsLoadingRiddle(true);
      const today = new Date().toDateString();
      const storedRiddle = localStorage.getItem('riddleOfTheDay');

      if (storedRiddle) {
        const { date, riddleId } = JSON.parse(storedRiddle);
        if (date === today) {
          // If stored riddle is from today, fetch it
          const riddle = await puzzleService.getRiddle(riddleId);
          setRiddleOfTheDay(riddle);
        } else {
          // If stored riddle is from a previous day, get a new random one
          await selectAndStoreRandomRiddle(today);
        }
      } else {
        // If no riddle is stored, get a new random one
        await selectAndStoreRandomRiddle(today);
      }
      setIsLoadingRiddle(false);
    };

    const selectAndStoreRandomRiddle = async (date: string) => {
      const allRiddles = await puzzleService.getAllRiddles();
      if (allRiddles.length > 0) {
        const randomIndex = Math.floor(Math.random() * allRiddles.length);
        const selectedRiddle = allRiddles[randomIndex];
        setRiddleOfTheDay(selectedRiddle);
        localStorage.setItem('riddleOfTheDay', JSON.stringify({ date, riddleId: selectedRiddle.id }));
      } else {
        setRiddleOfTheDay(null); // No riddles available
      }
    };

    fetchRiddleOfTheDay();
  }, []); // Empty dependency array to run only once on mount

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!answer.trim() || !riddleOfTheDay) return;
    
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = riddleOfTheDay.answer.toLowerCase();
    
    // Check if answer is correct (allowing for partial matches and common variations)
    const isAnswerCorrect = correctAnswer.includes(userAnswer) || 
                           userAnswer.includes(correctAnswer) ||
                           userAnswer === correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    // Clear the input
    setAnswer('');
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  return (
    // Main container for the home page content
    <Box 
      textAlign="center" 
      py={16} 
      px={6}
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      minH="100vh"
    >
      {/* Enhanced heading for the welcome message */}
      <Box mb={8}>
        <Heading
          as="h1"
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
          fontWeight="extrabold"
          mb={4}
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
          textShadow="0 4px 8px rgba(0,0,0,0.1)"
        >
          Welcome to Wizdle Maze
        </Heading>
        {/* Enhanced subheading/description */}
        <Text 
          fontSize={{ base: 'lg', sm: 'xl' }} 
          color="gray.600" 
          _dark={{ color: "gray.300" }}
          maxW="2xl"
          mx="auto"
          lineHeight="tall"
        >
          Challenge your mind with our collection of brain-teasing riddles. 
          From logic puzzles to wordplay challenges, discover a world of intellectual adventure.
        </Text>
      </Box>
      {/* Button to navigate to the riddles list */}
      <Button 
        as={RouterLink} 
        to="/riddles" 
        size="lg" 
        colorScheme="purple" 
        mb={10}
        px={8}
        py={6}
        fontSize="lg"
        fontWeight="bold"
        borderRadius="xl"
        boxShadow="lg"
        transition="all 0.3s ease"
        _hover={{ 
          transform: 'translateY(-2px)', 
          boxShadow: '2xl',
          bg: 'purple.600'
        }}
        _active={{ transform: 'translateY(0)' }}
      >
        View All Riddles
      </Button>

      {/* Section for displaying features */}
      <Box 
        as={Container} 
        maxW={'4xl'} 
        textAlign={'center'} 
        mt={16}
        p={8}
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderRadius="2xl"
        shadow="lg"
      >
        <Stack spacing={8}>
        <Heading as={'h2'} size={'lg'} color="purple.700" _dark={{ color: "purple.200" }}>Features</Heading>
        {/* Grid to display feature items responsively */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <FeatureItem
            imageSrc="/images/dailylogo.png"
            title="Daily Challenges"
            description="Fresh riddles delivered daily to test your skills."
          />
          <FeatureItem
            imageSrc="/images/wizard.png"
            title="AI-Powered Hints"
            description="Get smart hints when you're stuck, powered by AI."
          />
          <FeatureItem
            imageSrc="/images/expandlogo.png"
            title="Expand Your Mind"
            description="Explore a variety of riddle categories and difficulties."
          />
        </SimpleGrid>
        </Stack>
      </Box>

      {/* Riddle Categories Section */}
      <Box mt={16} p={8} bg="gray.50" _dark={{ bg: "gray.800" }} borderRadius="2xl">
        <Container maxW="4xl">
          <VStack spacing={8}>
            <Heading as="h2" size="lg" color="purple.700" _dark={{ color: "purple.200" }}>
              Explore Riddle Categories
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.300" }} textAlign="center">
              Jump into topics that interest you most
            </Text>
            
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
              {[
                { name: "Logic", color: "blue", count: "25+", icon: "🧠" },
                { name: "Wordplay", color: "green", count: "20+", icon: "📝" },
                { name: "Math", color: "orange", count: "15+", icon: "🔢" },
                { name: "Objects", color: "purple", count: "18+", icon: "🎯" }
              ].map((category) => (
                <Box
                  key={category.name}
                  as={RouterLink}
                  to="/riddles"
                  p={6}
                  bg="white"
                  _dark={{ bg: "gray.700" }}
                  borderRadius="xl"
                  textAlign="center"
                  shadow="md"
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: 'translateY(-4px)', 
                    shadow: 'xl',
                    bg: `${category.color}.50`,
                    _dark: { bg: `${category.color}.900` }
                  }}
                  cursor="pointer"
                >
                  <Text fontSize="3xl" mb={3}>{category.icon}</Text>
                  <Heading size="md" mb={2} color={`${category.color}.600`}>
                    {category.name}
                  </Heading>
                  <Badge colorScheme={category.color} variant="subtle">
                    {category.count} Riddles
                  </Badge>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Riddle of the Day Section with enhanced visual hierarchy */}
      <Box 
        mt={12} 
        p={8} 
        shadow="2xl" 
        borderWidth="2px" 
        borderColor="purple.200"
        borderRadius="2xl" 
        textAlign="left" 
        bg="white" 
        _dark={{ bg: "gray.800", borderColor: "purple.600" }} 
        maxW="800px" 
        mx="auto"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          bgGradient: 'linear(to-r, purple.400, pink.400)',
        }}
      >
        <Flex align="center" mb={6}>
           <Box 
             bg="purple.100" 
             _dark={{ bg: "purple.900" }}
             p={3} 
             borderRadius="full"
             mr={4}
           >
             <Image src="/images/riddleoftheday.png" alt="Riddle of the Day Icon" boxSize="50px" />
           </Box>
           <VStack align="start" spacing={1}>
             <Heading as="h2" size="lg" color="purple.700" _dark={{ color: "purple.200" }}>
               Riddle of the Day
             </Heading>
             <Badge colorScheme="purple" variant="subtle" fontSize="sm">
               Daily Challenge
             </Badge>
           </VStack>
        </Flex>

        {isLoadingRiddle ? (
          <Center py={10}>
            <Spinner size="lg" color="purple.500" thickness="4px" />
          </Center>
        ) : riddleOfTheDay ? (
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading as="h3" size="md" color="purple.600" _dark={{ color: "purple.300" }} mb={3}>
                {riddleOfTheDay.title}
              </Heading>
              <Text fontSize="md" color="gray.700" _dark={{ color: "gray.300" }} lineHeight="tall">
                {riddleOfTheDay.riddle.substring(0, 200)}{riddleOfTheDay.riddle.length > 200 ? '...' : ''}
              </Text>
            </Box>
            
            {/* Answer input field for direct interaction */}
            <Box>
              <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mb={2}>
                Think you know the answer? Give it a try!
              </Text>
              <HStack>
                <Input 
                  placeholder="Type your answer here..." 
                  size="md"
                  borderRadius="lg"
                  borderColor="purple.200"
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)' }}
                  _dark={{ borderColor: "purple.600" }}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                />
                <Button 
                  colorScheme="purple" 
                  size="md"
                  borderRadius="lg"
                  px={6}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
                  onClick={handleSubmitAnswer}
                  isDisabled={!answer.trim()}
                >
                  Submit
                </Button>
              </HStack>
              
              {/* Feedback message */}
              {showFeedback && (
                <Box 
                  mt={4} 
                  p={4} 
                  borderRadius="lg"
                  bg={isCorrect ? "green.50" : "red.50"}
                  _dark={{ 
                    bg: isCorrect ? "green.900" : "red.900",
                    borderColor: isCorrect ? "green.600" : "red.600"
                  }}
                  borderWidth="1px"
                  borderColor={isCorrect ? "green.200" : "red.200"}
                >
                  <Text 
                    color={isCorrect ? "green.700" : "red.700"}
                    _dark={{ color: isCorrect ? "green.200" : "red.200" }}
                    fontWeight="medium"
                    textAlign="center"
                  >
                    {isCorrect 
                      ? "🎉 Great job! That's correct!" 
                      : "❌ Not quite right. Try again or click 'Solve the Full Riddle' for help!"
                    }
                  </Text>
                </Box>
              )}
            </Box>
            
            <Button 
              as={RouterLink} 
              to={`/riddles/${riddleOfTheDay.id}`} 
              colorScheme="purple" 
              alignSelf="flex-start" 
              size="lg"
              borderRadius="xl"
              px={6}
              boxShadow="md"
              transition="all 0.3s ease"
              _hover={{ 
                transform: 'translateY(-2px)', 
                boxShadow: 'lg',
                bg: 'purple.600'
              }}
            >
              Solve the Full Riddle
            </Button>
          </VStack>
        ) : (
          <Text>No riddle of the day available.</Text>
        )}
      </Box>

    </Box>
  );
};

// Export the Home component
export default Home;