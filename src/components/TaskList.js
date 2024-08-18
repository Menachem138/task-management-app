import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, VStack, Text, Button, HStack, Badge } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const api = axios.create({
  baseURL: 'https://task-management-app-3dm2knbv.devinapps.com/api'
});

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(task =>
        task._id === id ? { ...response.data, isAnimating: true } : task
      ));

      // Reset the animation flag after a short delay
      setTimeout(() => {
        setTasks(tasks => tasks.map(task =>
          task._id === id ? { ...task, isAnimating: false } : task
        ));
      }, 500); // Adjust this value to match your animation duration
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {tasks.map(task => (
        <motion.div
          key={task._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box p={4} borderWidth={1} borderRadius="md">
            <HStack justifyContent="space-between">
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">{task.description}</Text>
                <Text>Deadline: {new Date(task.deadline).toLocaleDateString()}</Text>
                <Badge colorScheme={task.urgency === 'high' ? 'red' : task.urgency === 'medium' ? 'yellow' : 'green'}>
                  {task.urgency}
                </Badge>
              </VStack>
              <VStack>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    colorScheme={task.status === 'completed' ? 'green' : 'blue'}
                    onClick={() => updateTaskStatus(task._id, task.status === 'completed' ? 'in-progress' : 'completed')}
                  >
                    {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" colorScheme="red" onClick={() => deleteTask(task._id)}>
                    Delete
                  </Button>
                </motion.div>
              </VStack>
            </HStack>
          </Box>
        </motion.div>
      ))}
    </VStack>
  );
};

export default TaskList;
