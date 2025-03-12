import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { loanApplicationRouter } from './modules/loan-application/loan-application.routes';
import { RouteUri } from './enums/route-uri.enum';
import { connectMongoose } from './db/connect-mongoose';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(RouteUri.API, loanApplicationRouter);

// Database connection
connectMongoose();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
