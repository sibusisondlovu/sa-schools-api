// server.js
import express from 'express';
import dotenv from 'dotenv';
import schoolRoutes from './routes/schools.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', schoolRoutes);
app.use('/api/users', usersRoutes);

// Root Test
app.get('/', (req, res) => {
    res.send('School API is running ✅');
});


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
