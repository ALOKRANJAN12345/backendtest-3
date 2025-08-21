import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/dbConfig.js';
import cors from 'cors';


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Middleware
app.use(cors());
app.use(express.json());


connectDB();
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});