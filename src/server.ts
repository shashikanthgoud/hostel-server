import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';
import paymentRouter from './routes/payment.route';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions);

// Create an instance of Express
const app = express();
app.use(express.json());

// Enable CORS
app.use(cors());

// Register the userRouter under the /users route
app.use('/api/users', userRouter);
app.use('/api/payment', paymentRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
