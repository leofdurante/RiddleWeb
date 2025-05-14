import React, { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Container,
  Flex,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { ChatMessage, aiService } from '../services/aiService';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your riddle-solving assistant. I can help you by:\n\n1. Giving subtle hints\n2. Explaining concepts\n3. Breaking down complex riddles\n4. Suggesting approaches\n\nWhat would you like help with?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.chatWithAI([
        {
          role: 'system',
          content: 'You are a helpful riddle-solving assistant. Your goal is to help users solve riddles by providing subtle hints, explaining concepts, and guiding their thinking without giving away the answer. Be encouraging and creative in your approach.'
        },
        ...messages,
        newMessage
      ]);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI. Please check your API key.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={4}>
      <VStack spacing={4} align="stretch">
        <Heading size="md" mb={2}>AI Riddle Assistant</Heading>
        <Box
          height="400px"
          overflowY="auto"
          p={4}
          borderWidth={1}
          borderRadius="md"
          bg="gray.50"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              mb={4}
              p={3}
              borderRadius="md"
              bg={message.role === 'user' ? 'purple.100' : 'white'}
              borderWidth={1}
              borderColor={message.role === 'user' ? 'purple.200' : 'gray.200'}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Text whiteSpace="pre-line">{message.content}</Text>
            </Box>
          ))}
        </Box>
        <Divider />
        <Flex>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for help with the riddle..."
            mr={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <Button
            colorScheme="purple"
            onClick={handleSend}
            isLoading={isLoading}
          >
            Send
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
}; 