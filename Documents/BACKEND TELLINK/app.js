require('dotenv').config();

const express = require('express');
const { initializeFirebaseApp } = require('./firebase/firebase');
const router = require('./routes/route');
const path = require('path');
const http = require('http');
const { initSocket } = require('./utils/socket');


const app = express();

const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);


app.use(express.static(path.join(__dirname, 'public')));

initializeFirebaseApp();

app.use(express.json());
app.use('/api', router);

server.listen(3000, () => {
    console.log("🚀 Server berjalan di http://localhost:3000");
});