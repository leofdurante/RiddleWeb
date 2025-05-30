// src/components/AIChat.tsx

// Import necessary React hooks and Chakra UI components
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Flex,
  Avatar,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
// Import Riddle interface from puzzleService
import { Riddle } from '../services/puzzleService';
// Import aiService for AI interactions
import { aiService } from '../services/aiService';

// Interface for chat messages
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Interface for AIChat component props
interface AIChatProps {
  riddle: Riddle;
}

// AIChat component for the AI assistant chat interface
export const AIChat = ({ riddle }: AIChatProps) => {
  // State to store the chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State for the input field value
  const [input, setInput] = useState('');
  // State to indicate if the AI is loading a response
  const [isLoading, setIsLoading] = useState(false);
  // Ref for the last message element to enable auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Hook to display toast notifications
  const toast = useToast();

  // Determine background color for the chat area based on color mode
  const chatBg = useColorModeValue('gray.50', 'gray.700');
  // Determine background color for assistant message bubbles based on color mode
  const assistantBubbleBg = useColorModeValue('white', 'gray.600');
  // Determine text color for assistant message bubbles based on color mode
  const assistantBubbleColor = useColorModeValue('black', 'white');
  // Determine background color for the input field based on color mode
  const inputBg = useColorModeValue('white', 'gray.700');
  // Determine text color for the input field based on color mode
  const inputColor = useColorModeValue('gray.800', 'white');
  // Determine placeholder text color for the input field based on color mode
  const inputPlaceholderColor = useColorModeValue('gray.500', 'gray.400');

  // Function to scroll the chat to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect hook to scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Effect depends on the messages state

  // Async function to handle user input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    // Return if the input is empty or contains only whitespace
    if (!input.trim()) return;

    // Store the user's message
    const userMessage = input.trim();
    // Clear the input field
    setInput('');
    // Add the user's message to the messages state
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    // Set loading state to true
    setIsLoading(true);

    try {
      // Get a discussion response from the AI service
      const response = await aiService.getRiddleDiscussion(riddle, userMessage);
      // Add the AI's response to the messages state
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      // Log any errors during AI interaction and show an error toast
      console.error('Error calling AI API:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from AI. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // Set loading state to false after response or error
      setIsLoading(false);
    }
  };

  return (
    // Main container for the chat interface
    <Box h="500px" display="flex" flexDirection="column">
      {/* VStack for chat messages, allowing scrolling */}
      <VStack
        flex="1" // Takes up available vertical space
        overflowY="auto" // Enables vertical scrolling
        spacing={4} // Spacing between messages
        p={4} // Padding inside the chat area
        bg={chatBg} // Dynamic background based on color mode
        borderRadius="md" // Rounded corners
        mb={4} // Margin at the bottom
      >
        {/* Map over messages to display them */}
        {messages.map((message, index) => (
          // Flex container for each message, aligned based on role
          <Flex
            key={index} // Unique key for list rendering
            w="100%" // Full width
            justify={message.role === 'user' ? 'flex-end' : 'flex-start'} // Align user messages to the right, assistant to the left
          >
            {/* Flex container for the message bubble */}
            <Flex
              maxW="70%" // Maximum width for message bubbles
              bg={message.role === 'user' ? 'purple.500' : assistantBubbleBg} // Dynamic background for message bubbles
              color={message.role === 'user' ? 'white' : assistantBubbleColor} // Dynamic text color for message bubbles
              p={3} // Padding inside the bubble
              borderRadius="lg" // Rounded corners for the bubble
              boxShadow="sm" // Small shadow for the bubble
            >
              {/* Display AI avatar for assistant messages */}
              {message.role === 'assistant' && (
                <Avatar
                  size="sm" // Small avatar size
                  name="AI Assistant" // Alt text for the avatar
                  src="/ai-avatar.png" // Source path for the avatar image
                  mr={2} // Margin to the right of the avatar
                />
              )}
              {/* Message content text */}
              <Text>{message.content}</Text>
            </Flex>
          </Flex>
        ))}
        {/* Show spinner when AI is loading */}
        {isLoading && (
          <Flex justify="center" w="100%">
            <Spinner color="purple.500" />
          </Flex>
        )}
        {/* Ref for scrolling to the last message */}
        <div ref={messagesEndRef} />
      </VStack>

      {/* Form for user input */}
      <form onSubmit={handleSubmit}>
        {/* Flex container for input field and send button */}
        <Flex>
          {/* Input field for typing messages */}
          <Input
            value={input} // Bind input value to state
            onChange={(e) => setInput(e.target.value)} // Update state on input change
            placeholder="Ask for help with the riddle..." // Placeholder text
            mr={2} // Margin to the right
            disabled={isLoading} // Disable input while loading
            bg={inputBg} // Dynamic background based on color mode
            color={inputColor} // Dynamic text color based on color mode
            _placeholder={{
              color: inputPlaceholderColor // Dynamic placeholder color based on color mode
            }}
          />
          {/* Button to send message */}
          <Button
            type="submit" // Submit button type
            colorScheme="purple" // Button color scheme
            isLoading={isLoading} // Show loading spinner on button
            loadingText="Thinking..." // Text to show when loading
          >
            Send
          </Button>
        </Flex>
      </form>
    </Box>
  );
};