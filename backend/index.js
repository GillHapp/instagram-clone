import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

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

const PORT = 8000;
app.listen(PORT, (err, res) => {
    if (err) throw err;
    console.log(`Server running on port ${PORT}`);
})