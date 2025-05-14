import '@chakra-ui/react'

declare module '@chakra-ui/react' {
  interface ChakraProps {
    spacing?: number | string
    align?: string
    columns?: Record<string, number>
    noOfLines?: number
    isDisabled?: boolean
    gap?: number | string
    maxW?: string | number
    minH?: string | number
    bg?: string
    color?: string
    colorScheme?: string
    size?: string
    variant?: string
    shadow?: string
    rounded?: string
    transition?: string
    _hover?: Record<string, any>
  }

  interface InputGroupProps {
    children: React.ReactNode
    maxW?: string | number
  }

  interface SelectProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    maxW?: string | number
    children: React.ReactNode
  }
} 