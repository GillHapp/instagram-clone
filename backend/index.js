import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dbConnect from './database/db.js';
dotenv.config({});
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to the secure API!',
        success: true,
    });
});

app.listen(port, (err, res) => {
    if (err) throw err;
    dbConnect();
    console.log(`Server running on port ${port}`);
})