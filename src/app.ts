import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApiResult } from './types/api.types';
import applicationRoutes from './routes/application.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev')); // Use 'dev' format for logging HTTP requests

// Routes
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/auth', authRoutes);

// Catch-all for 404
app.use((req: Request, res: Response) => {
  const response: ApiResult<null> = { success: false, data: null, error: `Cannot find ${req.originalUrl} on this server!` };
  res.status(404).json(response);
});

// Error handling middleware (global)
app.use(errorHandler);

export default app;