// src/pages/Home.tsx

// Import necessary Chakra UI components
import { Box, Heading, Text, Button, Stack, SimpleGrid, Icon, Container, Image, Spinner, Center, VStack, Flex } from '@chakra-ui/react';
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
const FeatureItem = ({ icon, imageSrc, title, description }: FeatureItemProps) => (
  // Box container for the feature item with styling
  <Box p={6} shadow="md" borderWidth="1px" borderRadius="lg">
    {/* Icon or Image for the feature */}
    {imageSrc ? (
      <Image src={imageSrc} alt={`${title} icon`} boxSize="50px" mb={4} mx="auto" />
    ) : (
      <Icon as={icon} w={10} h={10} mb={4} color="purple.500" />
    )}
    {/* Title of the feature */}
    <Heading as="h3" size="md" mb={2}>
      {title}
    </Heading>
    {/* Description of the feature */}
    <Text>{description}</Text>
  </Box>
);

// Home page component
const Home = () => {
  // State for the riddle of the day
  const [riddleOfTheDay, setRiddleOfTheDay] = useState<Riddle | null>(null);
  // State to indicate if the riddle of the day is loading
  const [isLoadingRiddle, setIsLoadingRiddle] = useState(true);

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

  return (
    // Main container for the home page content
    <Box textAlign="center" py={10} px={6}>
      {/* Heading for the welcome message */}
      <Heading
        as="h1"
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
        fontWeight="bold"
        mb={4}
        // Gradient text color
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
      >
        Welcome to Wizdle Maze
      </Heading>
      {/* Subheading/description */}
      <Text fontSize={{ base: 'lg', sm: 'xl' }} color="gray.500" mb={8}>
        Challenge your mind with our collection of brain-teasing riddles
      </Text>
      {/* Button to navigate to the riddles list */}
      <Button as={RouterLink} to="/riddles" size="lg" colorScheme="purple" mb={10}>
        View All Riddles
      </Button>

      {/* Section for displaying features (Moved to be before Riddle of the Day) */}
      <Stack spacing={8} as={Container} maxW={'3xl'} textAlign={'center'} mt={12}>
        <Heading as={'h2'} size={'lg'}>Features</Heading>
        {/* Grid to display feature items responsively */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {/* Example Feature Items (Replace with actual icons and content as needed) */}
          <FeatureItem
            // icon={FiTarget} // Placeholder icon
            imageSrc="/images/dailylogo.png"
            title="Daily Challenges"
            description="Fresh riddles delivered daily to test your skills."
          />
          <FeatureItem
            // icon={FiCpu} // Placeholder icon
            imageSrc="/images/wizard.png"
            title="AI-Powered Hints"
            description="Get smart hints when you're stuck, powered by AI."
          />
          <FeatureItem
            // icon={FiTrophy} // Placeholder icon
            imageSrc="/images/expandlogo.png"
            title="Expand Your Mind"
            description="Explore a variety of riddle categories and difficulties."
          />
        </SimpleGrid>
      </Stack>

      {/* Riddle of the Day Section (Moved to be after Features) */}
      <Box mt={12} p={8} shadow="xl" borderWidth="1px" borderRadius="lg" textAlign="left" bg="purple.50" _dark={{ bg: "gray.700" }} maxW="800px" mx="auto">
        <Flex align="center" mb={4}>
           <Image src="/images/riddleoftheday.png" alt="Riddle of the Day Icon" boxSize="50px" mr={4} />
           <Heading as="h2" size="lg">Riddle of the Day</Heading>
        </Flex>

        {isLoadingRiddle ? (
          <Center py={10}>
            <Spinner size="md" color="purple.500" />
          </Center>
        ) : riddleOfTheDay ? (
          <VStack align="stretch" spacing={4}>
            <Heading as="h3" size="md" color="purple.600" _dark={{ color: "purple.300" }}>{riddleOfTheDay.title}</Heading>
            <Text fontSize="md" color="gray.700" _dark={{ color: "gray.300" }}>
              {riddleOfTheDay.riddle.substring(0, 200)}{riddleOfTheDay.riddle.length > 200 ? '...' : ''}
            </Text> {/* Show first 200 characters */}
            <Button as={RouterLink} to={`/riddles/${riddleOfTheDay.id}`} colorScheme="purple" alignSelf="flex-start" mt={4}>
              Solve the Riddle
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