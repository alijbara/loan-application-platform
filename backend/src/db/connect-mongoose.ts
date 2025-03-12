import mongoose from 'mongoose';

export function connectMongoose() {
  const dbPort = process.env.DB_PORT || '27017';
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) throw new Error('No db url was provided in environment variables');
  const dbName = process.env.DB_NAME;
  if (!dbName) throw new Error('No db name was provided in environment variables');

  mongoose
    .connect(`${dbUrl}:${dbPort}`, { dbName })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}
