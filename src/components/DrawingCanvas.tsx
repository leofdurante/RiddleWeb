// src/components/DrawingCanvas.tsx

// Import necessary React hooks and Chakra UI components
import React, { useState, useRef } from 'react';
import { Box, Button, ButtonGroup, useColorModeValue } from '@chakra-ui/react';
// Import Konva components for drawing on a canvas
import { Stage, Layer, Line } from 'react-konva';
// Import a custom hook to get window size for responsive canvas dimensions
import { useWindowSize } from '../hooks/useWindowSize';

// Define the interface for a point with x and y coordinates
interface Point {
  x: number;
  y: number;
}

// Define the interface for a drawn line, which includes an array of points and a color
interface DrawnLine {
  points: Point[];
  color: string;
}

// DrawingCanvas component provides a drawable area with color and clear options
export const DrawingCanvas: React.FC = () => {
  // State to store all drawn lines, each with its points and color
  const [lines, setLines] = useState<DrawnLine[]>([]);
  // State to track if the user is currently drawing
  const [isDrawing, setIsDrawing] = useState(false);
  // State to store the currently selected drawing color
  const [currentColor, setCurrentColor] = useState('#000000');
  // Ref to the Konva Stage component, used to get pointer position
  const stageRef = useRef<any>(null);
  // Get current window size for responsive canvas dimensions
  const { width, height } = useWindowSize();
  
  // Calculate canvas dimensions based on screen size, with a maximum width and height
  const canvasWidth = Math.min(width - 32, 600); // 32px for padding
  const canvasHeight = Math.min(height * 0.5, 400);

  // Handler for when the user starts drawing (mouse down or touch start)
  const handleStart = (e: any) => {
    setIsDrawing(true);
    // Get the pointer position relative to the stage
    const pos = e.target.getStage().getPointerPosition();
    // Start a new line with the current color and the initial point
    setLines([...lines, { points: [{ x: pos.x, y: pos.y }], color: currentColor }]);
  };

  // Handler for when the user is moving the pointer while drawing
  const handleMove = (e: any) => {
    // Only proceed if currently drawing
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    // Get the last drawn line segment
    const lastLine = lines[lines.length - 1];
    // Add the current point to the last line segment's points array
    lastLine.points = [...lastLine.points, { x: point.x, y: point.y }];

    // Update the state with the modified last line (immutably)
    setLines([...lines.slice(0, -1), lastLine]);
  };

  // Handler for when the user stops drawing (mouse up or touch end)
  const handleEnd = () => {
    setIsDrawing(false);
  };

  // Handler to clear all drawn lines from the canvas
  const clearCanvas = () => {
    setLines([]);
  };

  // Determine background color based on color mode
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    // Box container for the drawing canvas and controls
    <Box
      borderWidth={1}
      borderRadius="md"
      p={4}
      bg={bgColor}
      boxShadow="md"
      width="100%"
      maxW="600px"
      mx="auto"
    >
      {/* The drawing stage where lines are rendered */}
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        ref={stageRef}
        style={{ border: '1px solid #ccc' }}
      >
        {/* Layer for drawing lines */}
        <Layer>
          {/* Map over the drawn lines and render each one */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points.flatMap((p) => [p.x, p.y])} // Flatten points array for Konva Line
              stroke={line.color} // Use the stored color for this line
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
      {/* Button group for color selection and clearing the canvas */}
      <ButtonGroup 
        mt={4} 
        spacing={4} 
        display="flex" 
        flexWrap="wrap" 
        justifyContent="center"
        gap={2}
      >
        {/* Black color button */}
        <Button
          onClick={() => setCurrentColor('#000000')}
          bg={currentColor === '#000000' ? 'black' : 'gray.200'}
          color={currentColor === '#000000' ? 'white' : 'black'}
          size="sm"
        >
          Black
        </Button>
        {/* Red color button */}
        <Button
          onClick={() => setCurrentColor('#ff0000')}
          bg={currentColor === '#ff0000' ? 'red.500' : 'gray.200'}
          color={currentColor === '#ff0000' ? 'white' : 'black'}
          size="sm"
        >
          Red
        </Button>
        {/* Blue color button */}
        <Button
          onClick={() => setCurrentColor('#0000ff')}
          bg={currentColor === '#0000ff' ? 'blue.500' : 'gray.200'}
          color={currentColor === '#0000ff' ? 'white' : 'black'}
          size="sm"
        >
          Blue
        </Button>
        {/* Clear button to remove all lines */}
        <Button 
          onClick={clearCanvas} 
          colorScheme="red"
          size="sm"
        >
          Clear
        </Button>
      </ButtonGroup>
    </Box>
  );
}; 