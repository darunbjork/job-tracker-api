import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApiResult } from './types/api.types.js';
import applicationRoutes from './routes/application.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middlewares
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