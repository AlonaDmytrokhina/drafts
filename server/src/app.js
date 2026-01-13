import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

//для middleware
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorMiddleware);



export default app;