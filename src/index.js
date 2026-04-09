import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {createApp} from './app.js';

dotenv.config();

const start = async() => {
    await mongoose.connect(process.env.MONGO_URI);
    const app = createApp();
    const server = http.createServer(app);

    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
}

start();
