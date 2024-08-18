import React from 'react';
import axios from 'axios';
import { Box, VStack, Text, Button, HStack, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const api = axios.create({
  baseURL: 'https://task-management-app-3dm2knbv.devinapps.com/api'
});

const TaskList = ({ tasks, onTaskComplete, onTaskUpdated }) => {
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      onTaskUpdated();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      onTaskUpdated();

      if (newStatus === 'completed') {
        onTaskComplete();
      }
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
