import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use('/api', routes);
app.use(errorMiddleware);
app.use('/model', express.static('src/model'));



export default app;