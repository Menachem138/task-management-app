import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';

const api = axios.create({
  baseURL: 'https://task-management-app-3dm2knbv.devinapps.com/api'
});

const TaskForm = () => {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [urgency, setUrgency] = useState('low');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { description, deadline, urgency });
      setDescription('');
      setDeadline('');
      setUrgency('low');
      toast({
        title: 'Task created.',
        description: 'Your task has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error creating task:', error);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Deadline</FormLabel>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Urgency</FormLabel>
          <Select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Add Task
        </Button>
      </VStack>
    </Box>
  );
};

export default TaskForm;
