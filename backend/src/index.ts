import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { loanApplicationRouter } from './modules/loan-application/loan-application.routes';
import { RouteUri } from './enums/route-uri.enum';
import { connectDb } from './db/connect-mongoose';
import { currencyRouter } from './modules/currency/currency.routes';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(RouteUri.API, loanApplicationRouter);
app.use(RouteUri.API, currencyRouter);

// Database connection
connectDb();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
