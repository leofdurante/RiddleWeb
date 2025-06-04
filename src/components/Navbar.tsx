// src/components/Navbar.tsx

// Import necessary Chakra UI components and hooks
import { Box, Flex, Button, Heading, Spacer, useColorMode, useColorModeValue, Image, IconButton, Menu, MenuButton, MenuList, MenuItem, useBreakpointValue } from '@chakra-ui/react'
// Import Link component from react-router-dom for navigation
import { Link as RouterLink } from 'react-router-dom'
import { HamburgerIcon } from '@chakra-ui/icons'

// Navbar component
const Navbar = () => {
  // Hook to access and toggle color mode
  const { colorMode, toggleColorMode } = useColorMode()
  // Determine background color based on color mode
  const navbarBg = useColorModeValue('white', 'gray.800')
  // Determine heading color based on color mode
  const headingColor = useColorModeValue('purple.600', 'purple.300')
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    // Navbar container with dynamic background color and shadow
    <Box bg={navbarBg} px={4} shadow="sm" position="sticky" top={0} zIndex={1000}>
      {/* Flex container for Navbar content, centered and with vertical alignment */}
      <Flex maxW="1200px" mx="auto" h={16} alignItems="center">
        {/* Application heading, also acts as a link to the home page */}
        <Flex alignItems="center">
          <Image src="/images/logo.png" alt="Wizdle Maze Logo" boxSize="40px" mr={2} />
          <Heading as={RouterLink} to="/" size="md" color={headingColor}>
            Wizdle Maze
          </Heading>
        </Flex>
        {/* Spacer to push navigation items to the right */}
        <Spacer />
        {isMobile ? (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon />}
              variant="ghost"
              aria-label="Navigation menu"
            />
            <MenuList>
              <MenuItem as={RouterLink} to="/riddles">
                Riddles
              </MenuItem>
              <MenuItem onClick={toggleColorMode}>
                {colorMode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Flex gap={4}>
            {/* Link button to the riddles list page */}
            <Button as={RouterLink} to="/riddles" variant="ghost">
              Riddles
            </Button>
            {/* Button to toggle between light and dark mode */}
            <Button onClick={toggleColorMode} variant="ghost">
              {/* Display moon icon in light mode, sun icon in dark mode */}
              {colorMode === 'light' ? '🌙' : '☀️'}
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

// Export the Navbar component
export default Navbar 