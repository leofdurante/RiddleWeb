import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import {
  Box,
  Button,
  ButtonGroup,
  useColorModeValue,
} from '@chakra-ui/react';

interface Point {
  x: number;
  y: number;
}

export const DrawingCanvas: React.FC = () => {
  const [lines, setLines] = useState<Point[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(5);
  const stageRef = useRef<any>(null);

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, [{ x: pos.x, y: pos.y }]]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.push({ x: point.x, y: point.y });

    setLines([...lines.slice(0, -1), lastLine]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setLines([]);
  };

  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      p={4}
      bg={bgColor}
      boxShadow="md"
    >
      <Stage
        width={600}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        style={{ border: '1px solid #ccc' }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.flatMap((p) => [p.x, p.y])}
              stroke={currentColor}
              strokeWidth={currentWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
      <ButtonGroup mt={4} spacing={4}>
        <Button
          onClick={() => setCurrentColor('#000000')}
          bg={currentColor === '#000000' ? 'black' : 'gray.200'}
          color={currentColor === '#000000' ? 'white' : 'black'}
        >
          Black
        </Button>
        <Button
          onClick={() => setCurrentColor('#ff0000')}
          bg={currentColor === '#ff0000' ? 'red.500' : 'gray.200'}
          color={currentColor === '#ff0000' ? 'white' : 'black'}
        >
          Red
        </Button>
        <Button
          onClick={() => setCurrentColor('#0000ff')}
          bg={currentColor === '#0000ff' ? 'blue.500' : 'gray.200'}
          color={currentColor === '#0000ff' ? 'white' : 'black'}
        >
          Blue
        </Button>
        <Button onClick={clearCanvas} colorScheme="red">
          Clear
        </Button>
      </ButtonGroup>
    </Box>
  );
}; 