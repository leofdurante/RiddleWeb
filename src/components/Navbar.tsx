import { Box, Flex, Button, Heading, Spacer, useColorMode } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box bg="white" px={4} shadow="sm">
      <Flex maxW="1200px" mx="auto" h={16} alignItems="center">
        <Heading as={RouterLink} to="/" size="md" color="purple.600">
          RiddleMaster
        </Heading>
        <Spacer />
        <Flex gap={4}>
          <Button as={RouterLink} to="/riddles" variant="ghost">
            Riddles
          </Button>
          <Button as={RouterLink} to="/profile" variant="ghost">
            Profile
          </Button>
          <Button onClick={toggleColorMode} variant="ghost">
            {colorMode === 'light' ? '🌙' : '☀️'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar 