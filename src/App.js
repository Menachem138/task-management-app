import React from 'react';
import { ChakraProvider, Box, VStack, Heading } from '@chakra-ui/react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  return (
    <ChakraProvider>
      <Box maxWidth="800px" margin="0 auto" padding={4}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Task Manager
          </Heading>
          <TaskForm />
          <TaskList />
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
