    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
    const con = require('./dbconnect');
    const userRoute = require('./Routes/endpoints/user');
    const authRoute = require('./Routes/endpoints/auth');
    const path = require('path');

    app.use('/users', userRoute);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/auth', authRoute);
    app.use(express.static(path.join(__dirname, 'public')));
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'register.html'));
    });

    app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'register.html'));
    });





    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });