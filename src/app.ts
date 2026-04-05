require('dotenv').config();
import express, { Request, Response, Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { ApiResult } from './types/api.types'
import authRoutes from './routes/auth.routes'

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.get('/health', (req: Request, res: Response) => {
  const response: ApiResult<{ status: string, timestamp: string, message: string}> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'The health route is working'
    },
    error: null
  }

  res.status(200).json({response})
});

// 404 Fallback Handler
app.use((req: Request, res: Response) => {
  const response: ApiResult<null> = {
    success: false,
    data: null,
    error: 'Route not found'
  };

  res.status(404).json(response)
});

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

export default app;