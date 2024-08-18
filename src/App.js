import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Heading, useToast, Spinner, Text } from '@chakra-ui/react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import axios from 'axios';

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { width, height } = useWindowSize();
  const toast = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://task-management-app-3dm2knbv.devinapps.com/api/tasks');
      setTasks(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleTaskCompletion = () => {
    setShowConfetti(true);
    toast({
      title: "Congratulations!",
      description: "You've completed a task!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleTaskUpdate = (id, updatedTask) => {
    setTasks(tasks.map(task => task._id === id ? updatedTask : task));
  };

  const handleTaskDelete = (id) => {
    setTasks(tasks.filter(task => task._id !== id));
  };

  return (
    <ChakraProvider>
      <Box maxWidth="800px" margin="0 auto" padding={4}>
        {showConfetti && <Confetti width={width} height={height} recycle={false} />}
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Task Manager
          </Heading>
          <TaskForm onTaskAdded={fetchTasks} />
          {error && <Text color="red.500">{error}</Text>}
          {isLoading ? (
            <Spinner size="xl" />
          ) : (
            <TaskList
              tasks={tasks}
              onTaskComplete={handleTaskCompletion}
              onTaskUpdated={fetchTasks}
              onDeleteTask={(id) => setTasks(tasks.filter(task => task._id !== id))}
              onUpdateTaskStatus={(id, updatedTask) => setTasks(tasks.map(task => task._id === id ? updatedTask : task))}
            />
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
