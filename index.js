const express = require('express');
const redis = require('redis');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Redis setup
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
console.log('Attempting to connect to Redis at:', redisUrl);
const redisClient = redis.createClient({ url: redisUrl });
redisClient.on('error', (err) => console.log('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.connect().then(() => {
  console.log('Redis connection established');
}).catch((err) => {
  console.error('Redis connection failed:', err);
});

// MongoDB setup
const mongoUrl = process.env.MONGODB_URI || 'mongodb://172.17.0.2:27017/taskmanager';
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Task model
const Task = mongoose.model('Task', {
  description: String,
  deadline: Date,
  urgency: String,
  status: { type: String, default: 'in-progress' }
});

// Root route for health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API endpoints
app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    await redisClient.del('tasks'); // Invalidate cache
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const cachedTasks = await redisClient.get('tasks');
    if (cachedTasks) {
      console.log('Returning cached tasks');
      return res.json(JSON.parse(cachedTasks));
    }
    console.log('Fetching tasks from MongoDB');
    const tasks = await Task.find();
    await redisClient.set('tasks', JSON.stringify(tasks), { EX: 3600 }); // Cache for 1 hour
    console.log('Tasks cached in Redis');
    res.json(tasks);
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await redisClient.del('tasks'); // Invalidate cache
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await redisClient.del('tasks'); // Invalidate cache
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
