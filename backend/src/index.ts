import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
