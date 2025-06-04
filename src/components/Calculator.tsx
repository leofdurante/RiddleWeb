import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Input,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';

// Calculator component provides a basic interactive calculator
export const Calculator: React.FC = () => {
  // State to hold the current value displayed on the calculator screen
  const [display, setDisplay] = useState('0');
  // State to store the ongoing equation string
  const [equation, setEquation] = useState('');
  // State to determine if the display should be reset on the next number input
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  // Handler for number button clicks
  const handleNumber = (num: string) => {
    // If display is '0' or needs reset, replace it with the number
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      // Otherwise, append the number to the current display value
      setDisplay(display + num);
    }
  };

  // Handler for operator button clicks
  const handleOperator = (operator: string) => {
    // Append the current display value and the operator to the equation
    setEquation(display + ' ' + operator + ' ');
    // Set flag to reset display for the next number input
    setShouldResetDisplay(true);
  };

  // Handler for the equals button click
  const handleEqual = () => {
    try {
      // Evaluate the full equation string
      const result = eval(equation + display);
      // Set the display to the result (converted to string)
      setDisplay(String(result));
      // Clear the equation state
      setEquation('');
    } catch (error) {
      // If evaluation fails, display 'Error'
      setDisplay('Error');
    }
    // Set flag to reset display after result
    setShouldResetDisplay(true);
  };

  // Handler for the clear button click
  const handleClear = () => {
    // Reset display, equation, and the reset display flag
    setDisplay('0');
    setEquation('');
    setShouldResetDisplay(false);
  };

  // Hooks for adapting styles based on color mode and breakpoint
  const bgColor = useColorModeValue('white', 'gray.800');
  const buttonBg = useColorModeValue('gray.100', 'gray.700');
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const gridGap = useBreakpointValue({ base: 1, md: 2 });
  const maxWidth = useBreakpointValue({ base: '100%', md: '300px' });

  return (
    // Box container for the calculator layout
    <Box
      width="100%"
      maxW={maxWidth}
      borderWidth={1}
      borderRadius="md"
      p={4}
      bg={bgColor}
      boxShadow="md"
      mx="auto"
    >
      {/* Input field to display the equation and current number */}
      <Input
        value={equation + display} // Combine equation and display for full view
        readOnly // Prevent manual input
        mb={4}
        textAlign="right"
        fontSize={{ base: 'lg', md: 'xl' }}
        height={{ base: '40px', md: '48px' }}
      />
      {/* Grid layout for calculator buttons */}
      <Grid 
        templateColumns="repeat(4, 1fr)" // 4 columns with equal width
        gap={gridGap}
      >
        {/* Clear button */}
        <Button 
          onClick={handleClear} 
          colorScheme="red" 
          gridColumn="span 2" // Spans two columns
          size={buttonSize}
        >
          Clear
        </Button>
        {/* Division button */}
        <Button 
          onClick={() => handleOperator('/')} 
          bg={buttonBg}
          size={buttonSize}
        >
          ÷
        </Button>
        {/* Multiplication button */}
        <Button 
          onClick={() => handleOperator('*')} 
          bg={buttonBg}
          size={buttonSize}
        >
          ×
        </Button>
        {/* Map over numbers to create number buttons */}
        {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumber(String(num))}
            bg={buttonBg}
            size={buttonSize}
          >
            {num}
          </Button>
        ))}
        {/* Subtraction button */}
        <Button 
          onClick={() => handleOperator('-')} 
          bg={buttonBg}
          size={buttonSize}
        >
          -
        </Button>
        {/* Addition button */}
        <Button 
          onClick={() => handleOperator('+')} 
          bg={buttonBg}
          size={buttonSize}
        >
          +
        </Button>
        {/* Equals button */}
        <Button 
          onClick={handleEqual} 
          colorScheme="blue" 
          gridColumn="span 2" // Spans two columns
          size={buttonSize}
        >
          =
        </Button>
      </Grid>
    </Box>
  );
}; 