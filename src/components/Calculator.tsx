import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (operator: string) => {
    setEquation(display + ' ' + operator + ' ');
    setShouldResetDisplay(true);
  };

  const handleEqual = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
    } catch (error) {
      setDisplay('Error');
    }
    setShouldResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setShouldResetDisplay(false);
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const buttonBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      maxW="300px"
      borderWidth={1}
      borderRadius="md"
      p={4}
      bg={bgColor}
      boxShadow="md"
    >
      <Input
        value={equation + display}
        readOnly
        mb={4}
        textAlign="right"
        fontSize="xl"
      />
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        <Button onClick={handleClear} colorScheme="red" gridColumn="span 2">
          Clear
        </Button>
        <Button onClick={() => handleOperator('/')} bg={buttonBg}>
          ÷
        </Button>
        <Button onClick={() => handleOperator('*')} bg={buttonBg}>
          ×
        </Button>
        {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumber(String(num))}
            bg={buttonBg}
          >
            {num}
          </Button>
        ))}
        <Button onClick={() => handleOperator('-')} bg={buttonBg}>
          -
        </Button>
        <Button onClick={() => handleOperator('+')} bg={buttonBg}>
          +
        </Button>
        <Button onClick={handleEqual} colorScheme="blue" gridColumn="span 2">
          =
        </Button>
      </Grid>
    </Box>
  );
}; 