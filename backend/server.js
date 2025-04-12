import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiGateway from './api-gateway/index.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: "*", 
  credentials: true             
}));

app.use(express.json());
app.use('/', apiGateway); // all requests go through the gateway

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
